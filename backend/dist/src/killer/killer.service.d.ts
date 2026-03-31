import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../websocket/events/events.gateway';
import { CreateMissionDto, UpdateGameSettingsDto, ResolveEliminationDto } from './dto/killer.dto';
export declare class KillerService {
    private prisma;
    private events;
    constructor(prisma: PrismaService, events: EventsGateway);
    getMissions(): Promise<{
        id: string;
        description: string;
        isActive: boolean;
    }[]>;
    createMission(dto: CreateMissionDto): Promise<{
        id: string;
        description: string;
        isActive: boolean;
    }>;
    deleteMission(id: string): Promise<{
        message: string;
    }>;
    getOrCreateGame(): Promise<{
        assignments: ({
            mission: {
                id: string;
                description: string;
                isActive: boolean;
            } | null;
            killer: {
                id: string;
                displayName: string;
            };
            target: {
                id: string;
                displayName: string;
            };
        } & {
            id: string;
            gameId: string;
            killerId: string;
            targetId: string;
            missionId: string | null;
            isEliminated: boolean;
            eliminatedAt: Date | null;
        })[];
        participants: ({
            user: {
                id: string;
                displayName: string;
            };
        } & {
            id: string;
            userId: string;
            gameId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.GameStatus;
        showLeaderboard: boolean;
        startedAt: Date | null;
        finishedAt: Date | null;
    }>;
    updateSettings(id: string, dto: UpdateGameSettingsDto): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.GameStatus;
        showLeaderboard: boolean;
        startedAt: Date | null;
        finishedAt: Date | null;
    }>;
    toggleParticipant(gameId: string, userId: string): Promise<{
        participating: boolean;
    }>;
    startGame(gameId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.GameStatus;
        showLeaderboard: boolean;
        startedAt: Date | null;
        finishedAt: Date | null;
    }>;
    getMyAssignment(userId: string): Promise<{
        assignment: {
            mission: {
                id: string;
                description: string;
                isActive: boolean;
            } | null;
            game: {
                id: string;
                showLeaderboard: boolean;
            };
            target: {
                id: string;
                displayName: string;
            };
        } & {
            id: string;
            gameId: string;
            killerId: string;
            targetId: string;
            missionId: string | null;
            isEliminated: boolean;
            eliminatedAt: Date | null;
        };
        pendingRequest: ({
            game: {
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.EliminationStatus;
            gameId: string;
            killerId: string;
            targetId: string;
            resolvedAt: Date | null;
        }) | null;
    } | null>;
    requestElimination(killerId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.EliminationStatus;
        gameId: string;
        killerId: string;
        targetId: string;
        resolvedAt: Date | null;
    }>;
    resolveElimination(userId: string, dto: ResolveEliminationDto): Promise<{
        confirmed: boolean;
        survivorsLeft?: undefined;
    } | {
        confirmed: boolean;
        survivorsLeft: number;
    }>;
    getLeaderboard(gameId: string): Promise<{
        showLeaderboard: boolean;
        status: import("@prisma/client").$Enums.GameStatus;
        players: {
            player: {
                id: string;
                displayName: string;
            };
            isAlive: boolean;
            eliminatedAt: Date | null;
        }[];
    }>;
    resetGame(gameId: string): Promise<{
        message: string;
    }>;
}
