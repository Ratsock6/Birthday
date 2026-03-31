import { Module } from '@nestjs/common';
import { WallService } from './wall.service';
import { WallController } from './wall.controller';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  controllers: [WallController],
  providers: [WallService],
})
export class WallModule {}