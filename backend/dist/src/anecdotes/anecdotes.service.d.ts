import { PrismaService } from '../prisma/prisma.service';
import { CreateAnecdoteDto } from './dto/anecdote.dto';
export declare class AnecdotesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateAnecdoteDto): Promise<{
        user: {
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        isTrue: boolean;
    }>;
    findMine(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        isTrue: boolean;
    }[]>;
    findAll(): Promise<({
        user: {
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        isTrue: boolean;
    })[]>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
}
