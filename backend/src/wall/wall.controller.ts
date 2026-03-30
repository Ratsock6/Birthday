import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, Query,
} from '@nestjs/common';
import { WallService } from './wall.service';
import { EventsGateway } from '../websocket/events/events.gateway';
import { CreateWallMessageDto } from './dto/wall.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('wall')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WallController {
  constructor(
    private wallService: WallService,
    private events: EventsGateway,
  ) {}

  @Get()
  getMessages(@CurrentUser() user: { role: string }) {
    const isAdmin = user.role === Role.ADMIN;
    return this.wallService.getMessages(!isAdmin);
  }

  @Post()
  async createMessage(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateWallMessageDto,
  ) {
    const message = await this.wallService.createMessage(user.sub, dto);
    if (message.approved) {
      this.events.emitWallMessage(message); // broadcast WebSocket
    }
    return message;
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN)
  async approveMessage(@Param('id') id: string) {
    const message = await this.wallService.approveMessage(id);
    this.events.emitWallMessage(message);
    return message;
  }

  @Delete(':id')
  async deleteMessage(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    const result = await this.wallService.deleteMessage(
      id,
      user.sub,
      user.role === Role.ADMIN,
    );
    this.events.emitWallDelete(id);
    return result;
  }

  @Post(':id/like')
  async likeMessage(@Param('id') id: string) {
    const message = await this.wallService.likeMessage(id);
    this.events.emitWallLike(message);
    return message;
  }
}