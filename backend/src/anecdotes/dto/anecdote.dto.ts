// src/anecdotes/dto/anecdote.dto.ts
import { IsString, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class CreateAnecdoteDto {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  content: string;

  @IsBoolean()
  isTrue: boolean;
}
