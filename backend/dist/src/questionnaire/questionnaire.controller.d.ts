import { QuestionnaireService } from './questionnaire.service';
import { CreateQuestionnaireDto, UpdateQuestionnaireDto, CreateQuestionDto, SubmitAnswersDto } from './dto/questionnaire.dto';
export declare class QuestionnaireController {
    private questionnaireService;
    constructor(questionnaireService: QuestionnaireService);
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
    addQuestion(id: string, dto: CreateQuestionDto): Promise<{
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
}
