import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateWallMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content: string;
}