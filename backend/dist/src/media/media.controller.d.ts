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
        url: string;
        id: string;
        userId: string;
        approved: boolean;
        type: import("@prisma/client").$Enums.MediaType;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
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
        url: string;
        id: string;
        userId: string;
        approved: boolean;
        type: import("@prisma/client").$Enums.MediaType;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        uploadedAt: Date;
    }>;
    approve(id: string): Promise<{
        user: {
            id: string;
            displayName: string;
        };
    } & {
        url: string;
        id: string;
        userId: string;
        approved: boolean;
        type: import("@prisma/client").$Enums.MediaType;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        uploadedAt: Date;
    }>;
    remove(id: string, user: {
        sub: string;
        role: string;
    }): Promise<{
        message: string;
    }>;
}
