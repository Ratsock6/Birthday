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
        content: string;
        isTrue: boolean;
        createdAt: Date;
        userId: string;
    }>;
    findMine(user: {
        sub: string;
    }): Promise<{
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
    delete(id: string, user: {
        sub: string;
    }): Promise<{
        message: string;
    }>;
}
