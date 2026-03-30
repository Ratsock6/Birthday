// src/media/dto/media.dto.ts
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateMediaDto {
  @IsOptional()
  @IsBoolean()
  approved?: boolean;
}