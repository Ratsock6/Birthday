import { Server } from 'socket.io';
export declare class EventsGateway {
    server: Server;
    emitWallMessage(message: object): void;
    emitWallDelete(id: string): void;
    emitWallLike(message: object): void;
    emitKillerUpdate(game: object): void;
    emitNewMedia(media: object): void;
}
