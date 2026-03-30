import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../websocket/events/events.gateway';
import {
  CreateMissionDto,
  UpdateGameSettingsDto,
  ResolveEliminationDto,
} from './dto/killer.dto';

@Injectable()
export class KillerService {
  constructor(
    private prisma: PrismaService,
    private events: EventsGateway,
  ) {}

  // ─── MISSIONS ────────────────────────────────────────────────────────────

  async getMissions() {
    return this.prisma.killerMission.findMany({ orderBy: { description: 'asc' } });
  }

  async createMission(dto: CreateMissionDto) {
    return this.prisma.killerMission.create({ data: dto });
  }

  async deleteMission(id: string) {
    await this.prisma.killerMission.delete({ where: { id } });
    return { message: 'Mission supprimée' };
  }

  // ─── GAME ─────────────────────────────────────────────────────────────────

  async getOrCreateGame() {
    let game = await this.prisma.killerGame.findFirst({
      where: { status: { in: ['IDLE', 'RUNNING'] } },
      include: {
        participants: { include: { user: { select: { id: true, displayName: true } } } },
        assignments: {
          include: {
            killer: { select: { id: true, displayName: true } },
            target:  { select: { id: true, displayName: true } },
            mission: true,
          },
        },
      },
    });

    if (!game) {
      game = await this.prisma.killerGame.create({
        data: {},
        include: {
          participants: { include: { user: { select: { id: true, displayName: true } } } },
          assignments: {
            include: {
              killer: { select: { id: true, displayName: true } },
              target:  { select: { id: true, displayName: true } },
              mission: true,
            },
          },
        },
      });
    }

    return game;
  }

  async updateSettings(id: string, dto: UpdateGameSettingsDto) {
    const game = await this.prisma.killerGame.update({
      where: { id },
      data: dto,
    });
    this.events.emitKillerUpdate(game);
    return game;
  }

  // ─── PARTICIPANTS ─────────────────────────────────────────────────────────

  async toggleParticipant(gameId: string, userId: string) {
    const game = await this.prisma.killerGame.findUnique({ where: { id: gameId } });
    if (!game || game.status !== 'IDLE') {
      throw new BadRequestException('La partie est déjà lancée');
    }

    const existing = await this.prisma.killerParticipant.findUnique({
      where: { gameId_userId: { gameId, userId } },
    });

    if (existing) {
      await this.prisma.killerParticipant.delete({ where: { id: existing.id } });
      return { participating: false };
    } else {
      await this.prisma.killerParticipant.create({ data: { gameId, userId } });
      return { participating: true };
    }
  }

  // ─── START GAME ───────────────────────────────────────────────────────────

  async startGame(gameId: string) {
    const game = await this.prisma.killerGame.findUnique({
      where: { id: gameId },
      include: { participants: true },
    });

    if (!game) throw new NotFoundException('Partie introuvable');
    if (game.status !== 'IDLE') throw new BadRequestException('Partie déjà lancée');
    if (game.participants.length < 3) {
      throw new BadRequestException('Il faut au moins 3 participants');
    }

    // Récupère les missions actives
    const missions = await this.prisma.killerMission.findMany({
      where: { isActive: true },
    });

    // Mélange aléatoire des participants (Fisher-Yates)
    const players = [...game.participants].sort(() => Math.random() - 0.5);

    // Crée les assignations en cercle
    const assignments = players.map((player, index) => {
      const target = players[(index + 1) % players.length];
      const mission = missions.length > 0
        ? missions[Math.floor(Math.random() * missions.length)]
        : null;

      return {
        gameId,
        killerId: player.userId,
        targetId: target.userId,
        missionId: mission?.id ?? null,
      };
    });

    await this.prisma.killerAssignment.createMany({ data: assignments });

    const updatedGame = await this.prisma.killerGame.update({
      where: { id: gameId },
      data: { status: 'RUNNING', startedAt: new Date() },
    });

    this.events.emitKillerUpdate({ ...updatedGame, type: 'game_started' });
    return updatedGame;
  }

  // ─── MY ASSIGNMENT ────────────────────────────────────────────────────────

  async getMyAssignment(userId: string) {
    const assignment = await this.prisma.killerAssignment.findFirst({
      where: {
        killerId: userId,
        game: { status: 'RUNNING' },
      },
      include: {
        target: { select: { id: true, displayName: true } },
        mission: true,
        game: { select: { id: true, showLeaderboard: true } },
      },
    });

    if (!assignment) return null;

    // Vérifie si une demande d'élimination est en attente contre ce joueur
    const pendingRequest = await this.prisma.eliminationRequest.findFirst({
      where: {
        targetId: userId,
        status: 'PENDING',
        gameId: assignment.gameId,
      },
      include: {
        game: { select: { id: true } },
      },
    });

    return { assignment, pendingRequest };
  }

  // ─── ELIMINATION ──────────────────────────────────────────────────────────

  async requestElimination(killerId: string) {
    const assignment = await this.prisma.killerAssignment.findFirst({
      where: { killerId, game: { status: 'RUNNING' }, isEliminated: false },
      include: { game: true },
    });

    if (!assignment) throw new BadRequestException('Aucune cible active');

    // Vérifie qu'il n'y a pas déjà une demande en attente
    const existing = await this.prisma.eliminationRequest.findFirst({
      where: { killerId, targetId: assignment.targetId, status: 'PENDING' },
    });
    if (existing) throw new BadRequestException('Demande déjà en attente');

    const request = await this.prisma.eliminationRequest.create({
      data: {
        gameId: assignment.gameId,
        killerId,
        targetId: assignment.targetId,
      },
    });

    // Notifie la victime via WebSocket
    this.events.emitKillerUpdate({ type: 'elimination_request', targetId: assignment.targetId, requestId: request.id });
    return request;
  }

  async resolveElimination(userId: string, dto: ResolveEliminationDto) {
    const request = await this.prisma.eliminationRequest.findUnique({
      where: { id: dto.requestId },
    });

    if (!request) throw new NotFoundException('Demande introuvable');
    if (request.targetId !== userId) throw new ForbiddenException('Non autorisé');
    if (request.status !== 'PENDING') throw new BadRequestException('Demande déjà traitée');

    if (!dto.confirm) {
      // Victime rejette
      await this.prisma.eliminationRequest.update({
        where: { id: dto.requestId },
        data: { status: 'REJECTED', resolvedAt: new Date() },
      });
      this.events.emitKillerUpdate({ type: 'elimination_rejected', killerId: request.killerId });
      return { confirmed: false };
    }

    // Victime confirme — on traite l'élimination
    const [victimAssignment, killerAssignment] = await Promise.all([
      this.prisma.killerAssignment.findFirst({ where: { killerId: request.targetId } }),
      this.prisma.killerAssignment.findFirst({ where: { killerId: request.killerId } }),
    ]);

    await this.prisma.$transaction([
      // Marque la victime comme éliminée
      this.prisma.killerAssignment.update({
        where: { id: killerAssignment!.id },
        data: {
          isEliminated: false,
          // Le killer hérite de la cible de sa victime
          targetId: victimAssignment!.targetId,
        },
      }),
      // Marque l'assignment de la victime comme éliminé
      this.prisma.killerAssignment.updateMany({
        where: { killerId: request.targetId },
        data: { isEliminated: true, eliminatedAt: new Date() },
      }),
      // Clôt la demande
      this.prisma.eliminationRequest.update({
        where: { id: dto.requestId },
        data: { status: 'CONFIRMED', resolvedAt: new Date() },
      }),
    ]);

    // Vérifie s'il reste un seul survivant
    const survivors = await this.prisma.killerAssignment.count({
      where: { gameId: request.gameId, isEliminated: false },
    });

    if (survivors === 1) {
      await this.prisma.killerGame.update({
        where: { id: request.gameId },
        data: { status: 'FINISHED', finishedAt: new Date() },
      });
      this.events.emitKillerUpdate({ type: 'game_finished', gameId: request.gameId });
    } else {
      this.events.emitKillerUpdate({ type: 'elimination_confirmed', gameId: request.gameId });
    }

    return { confirmed: true, survivorsLeft: survivors };
  }

  // ─── LEADERBOARD ──────────────────────────────────────────────────────────

  async getLeaderboard(gameId: string) {
    const game = await this.prisma.killerGame.findUnique({ where: { id: gameId } });
    if (!game) throw new NotFoundException('Partie introuvable');

    const assignments = await this.prisma.killerAssignment.findMany({
      where: { gameId },
      include: { killer: { select: { id: true, displayName: true } } },
      orderBy: { eliminatedAt: 'desc' },
    });

    return {
      showLeaderboard: game.showLeaderboard,
      status: game.status,
      players: assignments.map(a => ({
        player: a.killer,
        isAlive: !a.isEliminated,
        eliminatedAt: a.eliminatedAt,
      })),
    };
  }

  async resetGame(gameId: string) {
    await this.prisma.killerGame.update({
        where: { id: gameId },
        data: { status: 'IDLE', startedAt: null, finishedAt: null },
    });
    await this.prisma.killerAssignment.deleteMany({ where: { gameId } });
    await this.prisma.eliminationRequest.deleteMany({ where: { gameId } });
    this.events.emitKillerUpdate({ type: 'game_reset', gameId });
    return { message: 'Partie réinitialisée' };
  }
}