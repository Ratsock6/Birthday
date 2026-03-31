import { PrismaService } from '../prisma/prisma.service';
import { CreateWallMessageDto } from './dto/wall.dto';
export declare class WallService {
    private prisma;
    constructor(prisma: PrismaService);
    getMessages(onlyApproved?: boolean): Promise<({
        user: {
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        approved: boolean;
        likes: number;
    })[]>;
    createMessage(userId: string, dto: CreateWallMessageDto): Promise<{
        user: {
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        approved: boolean;
        likes: number;
    }>;
    approveMessage(id: string): Promise<{
        user: {
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        approved: boolean;
        likes: number;
    }>;
    deleteMessage(id: string, userId: string, isAdmin: boolean): Promise<{
        message: string;
    }>;
    likeMessage(id: string): Promise<{
        user: {
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        approved: boolean;
        likes: number;
    }>;
}
