import { Module } from '@nestjs/common';
import { KillerService } from './killer.service';
import { KillerController } from './killer.controller';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  controllers: [KillerController],
  providers: [KillerService],
})
export class KillerModule {}