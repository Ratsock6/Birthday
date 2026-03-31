import {
  Controller, Get, Post, Delete, Patch, Param,
  Body, UseGuards,
} from '@nestjs/common';
import { KillerService } from './killer.service';
import {
  CreateMissionDto,
  UpdateGameSettingsDto,
  ToggleParticipantDto,
  ResolveEliminationDto,
} from './dto/killer.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('killer')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KillerController {
  constructor(private killerService: KillerService) {}

  // Missions (admin)
  @Get('missions')
  @Roles(Role.ADMIN)
  getMissions() { return this.killerService.getMissions(); }

  @Post('missions')
  @Roles(Role.ADMIN)
  createMission(@Body() dto: CreateMissionDto) { return this.killerService.createMission(dto); }

  @Delete('missions/:id')
  @Roles(Role.ADMIN)
  deleteMission(@Param('id') id: string) { return this.killerService.deleteMission(id); }

  // Game
  @Get('game')
  getGame() { return this.killerService.getOrCreateGame(); }

  @Patch('game/:id/settings')
  @Roles(Role.ADMIN)
  updateSettings(@Param('id') id: string, @Body() dto: UpdateGameSettingsDto) {
    return this.killerService.updateSettings(id, dto);
  }

  @Post('game/:id/participants')
  @Roles(Role.ADMIN)
  toggleParticipant(@Param('id') gameId: string, @Body() dto: ToggleParticipantDto) {
    return this.killerService.toggleParticipant(gameId, dto.userId);
  }

  @Post('game/:id/start')
  @Roles(Role.ADMIN)
  startGame(@Param('id') id: string) { return this.killerService.startGame(id); }

  @Post('game/:id/reset')
  @Roles(Role.ADMIN)
  resetGame(@Param('id') id: string) { return this.killerService.resetGame(id); }

  @Get('game/:id/leaderboard')
  getLeaderboard(@Param('id') id: string) { return this.killerService.getLeaderboard(id); }

  // Joueur
  @Get('assignment/me')
  getMyAssignment(@CurrentUser() user: { sub: string }) {
    return this.killerService.getMyAssignment(user.sub);
  }

  @Post('eliminate')
  requestElimination(@CurrentUser() user: { sub: string }) {
    return this.killerService.requestElimination(user.sub);
  }

  @Post('eliminate/resolve')
  resolveElimination(
    @CurrentUser() user: { sub: string },
    @Body() dto: ResolveEliminationDto,
  ) {
    return this.killerService.resolveElimination(user.sub, dto);
  }
}