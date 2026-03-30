import { QuestionnaireService } from './questionnaire.service';
import { CreateQuestionnaireDto, UpdateQuestionnaireDto, CreateQuestionDto, SubmitAnswersDto } from './dto/questionnaire.dto';
export declare class QuestionnaireController {
    private questionnaireService;
    constructor(questionnaireService: QuestionnaireService);
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
    addQuestion(id: string, dto: CreateQuestionDto): Promise<{
        id: string;
        text: string;
        type: import("@prisma/client").$Enums.QuestionType;
        options: string[];
        order: number;
        questionnaireId: string;
    }>;
    removeQuestion(questionId: string): Promise<{
        message: string;
    }>;
    getResults(id: string): Promise<{
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
    findAll(user: {
        role: string;
    }): Promise<({
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
            text: string;
            type: import("@prisma/client").$Enums.QuestionType;
            options: string[];
            order: number;
            questionnaireId: string;
        }[];
    } & {
        id: string;
        title: string;
        isOpen: boolean;
        createdAt: Date;
    }>;
    submitAnswers(user: {
        sub: string;
    }, questionnaireId: string, dto: SubmitAnswersDto): Promise<{
        message: string;
    }>;
    getMyAnswers(user: {
        sub: string;
    }, questionnaireId: string): Promise<{
        questionnaire: {
            questions: {
                id: string;
                text: string;
                type: import("@prisma/client").$Enums.QuestionType;
                options: string[];
                order: number;
                questionnaireId: string;
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
}
