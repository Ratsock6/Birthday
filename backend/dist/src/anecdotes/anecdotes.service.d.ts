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
        content: string;
        isTrue: boolean;
        createdAt: Date;
        userId: string;
    }>;
    findMine(userId: string): Promise<{
        id: string;
        content: string;
        isTrue: boolean;
        createdAt: Date;
        userId: string;
    }[]>;
    findAll(): Promise<({
        user: {
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        content: string;
        isTrue: boolean;
        createdAt: Date;
        userId: string;
    })[]>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
}
