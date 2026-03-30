import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsString()
  displayName: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}