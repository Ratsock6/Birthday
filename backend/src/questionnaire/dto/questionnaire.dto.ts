import {
  IsString, IsEnum, IsOptional, IsArray,
  IsBoolean, IsInt, Min, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '@prisma/client';

export class CreateQuestionnaireDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;
}

export class UpdateQuestionnaireDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;
}

export class CreateQuestionDto {
  @IsString()
  text: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class AnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  value: string;
}

export class SubmitAnswersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}