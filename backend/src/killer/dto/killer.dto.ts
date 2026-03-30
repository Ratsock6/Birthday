import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMissionDto {
  @IsString()
  description: string;
}

export class UpdateGameSettingsDto {
  @IsOptional()
  @IsBoolean()
  showLeaderboard?: boolean;
}

export class ToggleParticipantDto {
  @IsUUID()
  userId: string;
}

export class ResolveEliminationDto {
  @IsUUID()
  requestId: string;

  @IsBoolean()
  confirm: boolean;
}