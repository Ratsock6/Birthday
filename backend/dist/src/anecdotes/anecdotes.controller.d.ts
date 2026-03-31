import { AnecdotesService } from './anecdotes.service';
import { CreateAnecdoteDto } from './dto/anecdote.dto';
export declare class AnecdotesController {
    private anecdotesService;
    constructor(anecdotesService: AnecdotesService);
    create(user: {
        sub: string;
    }, dto: CreateAnecdoteDto): Promise<{
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
    findMine(user: {
        sub: string;
    }): Promise<{
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
    delete(id: string, user: {
        sub: string;
    }): Promise<{
        message: string;
    }>;
}
