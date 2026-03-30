import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionnaireDto, UpdateQuestionnaireDto, CreateQuestionDto, SubmitAnswersDto } from './dto/questionnaire.dto';
export declare class QuestionnaireService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(onlyOpen?: boolean): Promise<({
        _count: {
            questions: number;
        };
    } & {
        id: string;
        title: string;
        isOpen: boolean;
        createdAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        questions: {
            id: string;
            order: number;
            questionnaireId: string;
            text: string;
            type: import("@prisma/client").$Enums.QuestionType;
            options: string[];
        }[];
    } & {
        id: string;
        title: string;
        isOpen: boolean;
        createdAt: Date;
    }>;
    create(dto: CreateQuestionnaireDto): Promise<{
        id: string;
        title: string;
        isOpen: boolean;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateQuestionnaireDto): Promise<{
        id: string;
        title: string;
        isOpen: boolean;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addQuestion(questionnaireId: string, dto: CreateQuestionDto): Promise<{
        id: string;
        order: number;
        questionnaireId: string;
        text: string;
        type: import("@prisma/client").$Enums.QuestionType;
        options: string[];
    }>;
    removeQuestion(questionId: string): Promise<{
        message: string;
    }>;
    submitAnswers(userId: string, questionnaireId: string, dto: SubmitAnswersDto): Promise<{
        message: string;
    }>;
    getMyAnswers(userId: string, questionnaireId: string): Promise<{
        questionnaire: {
            questions: {
                id: string;
                order: number;
                questionnaireId: string;
                text: string;
                type: import("@prisma/client").$Enums.QuestionType;
                options: string[];
            }[];
        } & {
            id: string;
            title: string;
            isOpen: boolean;
            createdAt: Date;
        };
        answers: {
            id: string;
            questionId: string;
            userId: string;
            value: string;
            answeredAt: Date;
        }[];
    }>;
    getResults(questionnaireId: string): Promise<{
        questionnaire: {
            id: string;
            title: string;
            isOpen: boolean;
        };
        totalGuests: number;
        questions: {
            id: string;
            text: string;
            type: import("@prisma/client").$Enums.QuestionType;
            options: string[];
            answeredBy: number;
            answers: {
                user: {
                    id: string;
                    displayName: string;
                };
                value: string;
                answeredAt: Date;
            }[];
        }[];
    }>;
}
