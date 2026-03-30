import { PrismaService } from '../prisma/prisma.service';
import { UpdateRsvpDto } from './dto/rsvp.dto';
export declare class RsvpService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyRsvp(userId: string): Promise<({
        user: {
            displayName: string;
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.RsvpStatus;
        note: string | null;
    }) | null>;
    upsertRsvp(userId: string, dto: UpdateRsvpDto): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.RsvpStatus;
        note: string | null;
    }>;
    getAllRsvp(): Promise<{
        rsvps: ({
            user: {
                id: string;
                username: string;
                displayName: string;
            };
        } & {
            id: string;
            updatedAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.RsvpStatus;
            note: string | null;
        })[];
        stats: {
            total: number;
            confirmed: number;
            declined: number;
            maybe: number;
            pending: number;
        };
    }>;
}
