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
        createdAt: Date;
        title: string;
        isOpen: boolean;
    })[]>;
    findOne(id: string): Promise<{
        questions: {
            options: string[];
            id: string;
            type: import("@prisma/client").$Enums.QuestionType;
            text: string;
            order: number;
            questionnaireId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
        isOpen: boolean;
    }>;
    create(dto: CreateQuestionnaireDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        isOpen: boolean;
    }>;
    update(id: string, dto: UpdateQuestionnaireDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        isOpen: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addQuestion(questionnaireId: string, dto: CreateQuestionDto): Promise<{
        options: string[];
        id: string;
        type: import("@prisma/client").$Enums.QuestionType;
        text: string;
        order: number;
        questionnaireId: string;
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
                options: string[];
                id: string;
                type: import("@prisma/client").$Enums.QuestionType;
                text: string;
                order: number;
                questionnaireId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            title: string;
            isOpen: boolean;
        };
        answers: {
            id: string;
            userId: string;
            questionId: string;
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
