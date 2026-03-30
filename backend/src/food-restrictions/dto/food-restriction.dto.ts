
import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { DietType } from '@prisma/client';

export class UpdateFoodRestrictionDto {
  @IsOptional()
  @IsEnum(DietType)
  diet?: DietType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];

  @IsOptional()
  @IsString()
  details?: string;
}