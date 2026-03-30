import { MediaService } from './media.service';
export declare class MediaController {
    private mediaService;
    constructor(mediaService: MediaService);
    findAll(user: {
        role: string;
    }): Promise<({
        user: {
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        type: import("@prisma/client").$Enums.MediaType;
        url: string;
        approved: boolean;
        userId: string;
        uploadedAt: Date;
    })[]>;
    upload(user: {
        sub: string;
    }, file: Express.Multer.File): Promise<{
        user: {
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        type: import("@prisma/client").$Enums.MediaType;
        url: string;
        approved: boolean;
        userId: string;
        uploadedAt: Date;
    }>;
    approve(id: string): Promise<{
        user: {
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        type: import("@prisma/client").$Enums.MediaType;
        url: string;
        approved: boolean;
        userId: string;
        uploadedAt: Date;
    }>;
    remove(id: string, user: {
        sub: string;
        role: string;
    }): Promise<{
        message: string;
    }>;
}
