"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionnaireService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuestionnaireService = class QuestionnaireService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(onlyOpen = false) {
        return this.prisma.questionnaire.findMany({
            where: onlyOpen ? { isOpen: true } : {},
            include: { _count: { select: { questions: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const q = await this.prisma.questionnaire.findUnique({
            where: { id },
            include: {
                questions: { orderBy: { order: 'asc' } },
            },
        });
        if (!q)
            throw new common_1.NotFoundException('Questionnaire introuvable');
        return q;
    }
    async create(dto) {
        return this.prisma.questionnaire.create({ data: dto });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.questionnaire.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.questionnaire.delete({ where: { id } });
        return { message: 'Questionnaire supprimé' };
    }
    async addQuestion(questionnaireId, dto) {
        await this.findOne(questionnaireId);
        return this.prisma.question.create({
            data: { ...dto, questionnaireId },
        });
    }
    async removeQuestion(questionId) {
        await this.prisma.question.delete({ where: { id: questionId } });
        return { message: 'Question supprimée' };
    }
    async submitAnswers(userId, questionnaireId, dto) {
        const questionnaire = await this.findOne(questionnaireId);
        if (!questionnaire.isOpen) {
            throw new common_1.BadRequestException('Ce questionnaire est fermé');
        }
        const questionIds = questionnaire.questions.map(q => q.id);
        const invalid = dto.answers.find(a => !questionIds.includes(a.questionId));
        if (invalid)
            throw new common_1.BadRequestException('Question invalide');
        const upserts = dto.answers.map(answer => this.prisma.answer.upsert({
            where: { questionId_userId: { questionId: answer.questionId, userId } },
            update: { value: answer.value },
            create: { questionId: answer.questionId, userId, value: answer.value },
        }));
        await this.prisma.$transaction(upserts);
        return { message: 'Réponses enregistrées' };
    }
    async getMyAnswers(userId, questionnaireId) {
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
    async getResults(questionnaireId) {
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
        if (!questionnaire)
            throw new common_1.NotFoundException('Questionnaire introuvable');
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
};
exports.QuestionnaireService = QuestionnaireService;
exports.QuestionnaireService = QuestionnaireService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionnaireService);
//# sourceMappingURL=questionnaire.service.js.map