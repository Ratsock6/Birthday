export declare class CreateMissionDto {
    description: string;
}
export declare class UpdateGameSettingsDto {
    showLeaderboard?: boolean;
}
export declare class ToggleParticipantDto {
    userId: string;
}
export declare class ResolveEliminationDto {
    requestId: string;
    confirm: boolean;
}
