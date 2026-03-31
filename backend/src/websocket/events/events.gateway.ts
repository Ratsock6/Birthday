import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  emitWallMessage(message: object) {
    this.server.emit('wall:new_message', message);
  }

  emitWallDelete(id: string) {
    this.server.emit('wall:delete', { id });
  }

  emitWallLike(message: object) {
    this.server.emit('wall:like', message);
  }

  emitKillerUpdate(game: object) {
    this.server.emit('killer:update', game);
  }

  emitNewMedia(media: object) {
    this.server.emit('media:new', media);
  }
}