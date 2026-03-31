import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { RsvpService } from './rsvp.service';
import { UpdateRsvpDto } from './dto/rsvp.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('rsvp')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RsvpController {
  constructor(private rsvpService: RsvpService) {}

  @Get('me')
  getMyRsvp(@CurrentUser() user: { sub: string }) {
    return this.rsvpService.getMyRsvp(user.sub);
  }

  @Put('me')
  upsertRsvp(@CurrentUser() user: { sub: string }, @Body() dto: UpdateRsvpDto) {
    return this.rsvpService.upsertRsvp(user.sub, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  getAllRsvp() {
    return this.rsvpService.getAllRsvp();
  }
}