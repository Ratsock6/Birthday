import { RsvpStatus } from '@prisma/client';
export declare class UpdateRsvpDto {
    status: RsvpStatus;
    note?: string;
}
