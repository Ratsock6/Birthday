import { WallService } from './wall.service';
import { EventsGateway } from '../websocket/events/events.gateway';
import { CreateWallMessageDto } from './dto/wall.dto';
export declare class WallController {
    private wallService;
    private events;
    constructor(wallService: WallService, events: EventsGateway);
    getMessages(user: {
        role: string;
    }): Promise<({
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
    createMessage(user: {
        sub: string;
    }, dto: CreateWallMessageDto): Promise<{
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
    deleteMessage(id: string, user: {
        sub: string;
        role: string;
    }): Promise<{
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
