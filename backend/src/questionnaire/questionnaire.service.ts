import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateQuestionnaireDto, UpdateQuestionnaireDto,
  CreateQuestionDto, SubmitAnswersDto,
} from './dto/questionnaire.dto';

@Injectable()
export class QuestionnaireService {
  constructor(private prisma: PrismaService) {}

  // ─── QUESTIONNAIRES ───────────────────────────────────────────────────────

  async findAll(onlyOpen = false) {
    return this.prisma.questionnaire.findMany({
      where: onlyOpen ? { isOpen: true } : {},
      include: { _count: { select: { questions: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const q = await this.prisma.questionnaire.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { order: 'asc' } },
      },
    });
    if (!q) throw new NotFoundException('Questionnaire introuvable');
    return q;
  }

  async create(dto: CreateQuestionnaireDto) {
    return this.prisma.questionnaire.create({ data: dto });
  }

  async update(id: string, dto: UpdateQuestionnaireDto) {
    await this.findOne(id);
    return this.prisma.questionnaire.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.questionnaire.delete({ where: { id } });
    return { message: 'Questionnaire supprimé' };
  }

  // ─── QUESTIONS ────────────────────────────────────────────────────────────

  async addQuestion(questionnaireId: string, dto: CreateQuestionDto) {
    await this.findOne(questionnaireId);
    return this.prisma.question.create({
      data: { ...dto, questionnaireId },
    });
  }

  async removeQuestion(questionId: string) {
    await this.prisma.question.delete({ where: { id: questionId } });
    return { message: 'Question supprimée' };
  }

  // ─── RÉPONSES ─────────────────────────────────────────────────────────────

  async submitAnswers(userId: string, questionnaireId: string, dto: SubmitAnswersDto) {
    const questionnaire = await this.findOne(questionnaireId);

    if (!questionnaire.isOpen) {
      throw new BadRequestException('Ce questionnaire est fermé');
    }

    const questionIds = questionnaire.questions.map(q => q.id);

    // Vérifie que toutes les questions appartiennent bien à ce questionnaire
    const invalid = dto.answers.find(a => !questionIds.includes(a.questionId));
    if (invalid) throw new BadRequestException('Question invalide');

    // Upsert chaque réponse (permet de modifier ses réponses)
    const upserts = dto.answers.map(answer =>
      this.prisma.answer.upsert({
        where: { questionId_userId: { questionId: answer.questionId, userId } },
        update: { value: answer.value },
        create: { questionId: answer.questionId, userId, value: answer.value },
      }),
    );

    await this.prisma.$transaction(upserts);
    return { message: 'Réponses enregistrées' };
  }

  async getMyAnswers(userId: string, questionnaireId: string) {
    const questionnaire = await this.findOne(questionnaireId);
    const answers = await this.prisma.answer.findMany({
      where: {
        userId,
        question: { questionnaireId },
      },
    });

    return {
      questionnaire,
      answers,
    };
  }

  // ─── RÉSULTATS ADMIN ──────────────────────────────────────────────────────

  async getResults(questionnaireId: string) {
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { id: questionnaireId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            answers: {
              include: {
                user: { select: { id: true, displayName: true } },
              },
            },
          },
        },
      },
    });

    if (!questionnaire) throw new NotFoundException('Questionnaire introuvable');

    const totalGuests = await this.prisma.user.count({ where: { role: 'GUEST' } });

    return {
      questionnaire: {
        id: questionnaire.id,
        title: questionnaire.title,
        isOpen: questionnaire.isOpen,
      },
      totalGuests,
      questions: questionnaire.questions.map(q => ({
        id: q.id,
        text: q.text,
        type: q.type,
        options: q.options,
        answeredBy: q.answers.length,
        answers: q.answers.map(a => ({
          user: a.user,
          value: a.value,
          answeredAt: a.answeredAt,
        })),
      })),
    };
  }
}