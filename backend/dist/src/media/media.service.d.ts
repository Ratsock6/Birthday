import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../websocket/events/events.gateway';
export declare class MediaService {
    private prisma;
    private events;
    constructor(prisma: PrismaService, events: EventsGateway);
    findAll(onlyApproved?: boolean): Promise<({
        user: {
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        userId: string;
        approved: boolean;
        type: import("@prisma/client").$Enums.MediaType;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        uploadedAt: Date;
    })[]>;
    upload(userId: string, file: Express.Multer.File): Promise<{
        user: {
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        userId: string;
        approved: boolean;
        type: import("@prisma/client").$Enums.MediaType;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        uploadedAt: Date;
    }>;
    approve(id: string): Promise<{
        user: {
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        userId: string;
        approved: boolean;
        type: import("@prisma/client").$Enums.MediaType;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        uploadedAt: Date;
    }>;
    remove(id: string, userId: string, isAdmin: boolean): Promise<{
        message: string;
    }>;
}
