import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RsvpStatus } from '@prisma/client';

export class UpdateRsvpDto {
  @IsEnum(RsvpStatus)
  status: RsvpStatus;

  @IsOptional()
  @IsString()
  note?: string;
}