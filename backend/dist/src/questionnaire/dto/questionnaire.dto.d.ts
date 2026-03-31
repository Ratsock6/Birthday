import { QuestionType } from '@prisma/client';
export declare class CreateQuestionnaireDto {
    title: string;
    isOpen?: boolean;
}
export declare class UpdateQuestionnaireDto {
    title?: string;
    isOpen?: boolean;
}
export declare class CreateQuestionDto {
    text: string;
    type: QuestionType;
    options?: string[];
    order?: number;
}
export declare class AnswerDto {
    questionId: string;
    value: string;
}
export declare class SubmitAnswersDto {
    answers: AnswerDto[];
}
