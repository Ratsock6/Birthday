"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KillerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const events_gateway_1 = require("../websocket/events/events.gateway");
let KillerService = class KillerService {
    prisma;
    events;
    constructor(prisma, events) {
        this.prisma = prisma;
        this.events = events;
    }
    async getMissions() {
        return this.prisma.killerMission.findMany({ orderBy: { description: 'asc' } });
    }
    async createMission(dto) {
        return this.prisma.killerMission.create({ data: dto });
    }
    async deleteMission(id) {
        await this.prisma.killerMission.delete({ where: { id } });
        return { message: 'Mission supprimée' };
    }
    async getOrCreateGame() {
        let game = await this.prisma.killerGame.findFirst({
            where: { status: { in: ['IDLE', 'RUNNING'] } },
            include: {
                participants: { include: { user: { select: { id: true, displayName: true } } } },
                assignments: {
                    include: {
                        killer: { select: { id: true, displayName: true } },
                        target: { select: { id: true, displayName: true } },
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
                            target: { select: { id: true, displayName: true } },
                            mission: true,
                        },
                    },
                },
            });
        }
        return game;
    }
    async updateSettings(id, dto) {
        const game = await this.prisma.killerGame.update({
            where: { id },
            data: dto,
        });
        this.events.emitKillerUpdate(game);
        return game;
    }
    async toggleParticipant(gameId, userId) {
        const game = await this.prisma.killerGame.findUnique({ where: { id: gameId } });
        if (!game || game.status !== 'IDLE') {
            throw new common_1.BadRequestException('La partie est déjà lancée');
        }
        const existing = await this.prisma.killerParticipant.findUnique({
            where: { gameId_userId: { gameId, userId } },
        });
        if (existing) {
            await this.prisma.killerParticipant.delete({ where: { id: existing.id } });
            return { participating: false };
        }
        else {
            await this.prisma.killerParticipant.create({ data: { gameId, userId } });
            return { participating: true };
        }
    }
    async startGame(gameId) {
        const game = await this.prisma.killerGame.findUnique({
            where: { id: gameId },
            include: { participants: true },
        });
        if (!game)
            throw new common_1.NotFoundException('Partie introuvable');
        if (game.status !== 'IDLE')
            throw new common_1.BadRequestException('Partie déjà lancée');
        if (game.participants.length < 3) {
            throw new common_1.BadRequestException('Il faut au moins 3 participants');
        }
        const missions = await this.prisma.killerMission.findMany({
            where: { isActive: true },
        });
        const players = [...game.participants].sort(() => Math.random() - 0.5);
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
    async getMyAssignment(userId) {
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
        if (!assignment)
            return null;
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
    async requestElimination(killerId) {
        const assignment = await this.prisma.killerAssignment.findFirst({
            where: { killerId, game: { status: 'RUNNING' }, isEliminated: false },
            include: { game: true },
        });
        if (!assignment)
            throw new common_1.BadRequestException('Aucune cible active');
        const existing = await this.prisma.eliminationRequest.findFirst({
            where: { killerId, targetId: assignment.targetId, status: 'PENDING' },
        });
        if (existing)
            throw new common_1.BadRequestException('Demande déjà en attente');
        const request = await this.prisma.eliminationRequest.create({
            data: {
                gameId: assignment.gameId,
                killerId,
                targetId: assignment.targetId,
            },
        });
        this.events.emitKillerUpdate({ type: 'elimination_request', targetId: assignment.targetId, requestId: request.id });
        return request;
    }
    async resolveElimination(userId, dto) {
        const request = await this.prisma.eliminationRequest.findUnique({
            where: { id: dto.requestId },
        });
        if (!request)
            throw new common_1.NotFoundException('Demande introuvable');
        if (request.targetId !== userId)
            throw new common_1.ForbiddenException('Non autorisé');
        if (request.status !== 'PENDING')
            throw new common_1.BadRequestException('Demande déjà traitée');
        if (!dto.confirm) {
            await this.prisma.eliminationRequest.update({
                where: { id: dto.requestId },
                data: { status: 'REJECTED', resolvedAt: new Date() },
            });
            this.events.emitKillerUpdate({ type: 'elimination_rejected', killerId: request.killerId });
            return { confirmed: false };
        }
        const [victimAssignment, killerAssignment] = await Promise.all([
            this.prisma.killerAssignment.findFirst({ where: { killerId: request.targetId } }),
            this.prisma.killerAssignment.findFirst({ where: { killerId: request.killerId } }),
        ]);
        await this.prisma.$transaction([
            this.prisma.killerAssignment.update({
                where: { id: killerAssignment.id },
                data: {
                    isEliminated: false,
                    targetId: victimAssignment.targetId,
                },
            }),
            this.prisma.killerAssignment.updateMany({
                where: { killerId: request.targetId },
                data: { isEliminated: true, eliminatedAt: new Date() },
            }),
            this.prisma.eliminationRequest.update({
                where: { id: dto.requestId },
                data: { status: 'CONFIRMED', resolvedAt: new Date() },
            }),
        ]);
        const survivors = await this.prisma.killerAssignment.count({
            where: { gameId: request.gameId, isEliminated: false },
        });
        if (survivors === 1) {
            await this.prisma.killerGame.update({
                where: { id: request.gameId },
                data: { status: 'FINISHED', finishedAt: new Date() },
            });
            this.events.emitKillerUpdate({ type: 'game_finished', gameId: request.gameId });
        }
        else {
            this.events.emitKillerUpdate({ type: 'elimination_confirmed', gameId: request.gameId });
        }
        return { confirmed: true, survivorsLeft: survivors };
    }
    async getLeaderboard(gameId) {
        const game = await this.prisma.killerGame.findUnique({ where: { id: gameId } });
        if (!game)
            throw new common_1.NotFoundException('Partie introuvable');
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
    async resetGame(gameId) {
        await this.prisma.killerGame.update({
            where: { id: gameId },
            data: { status: 'IDLE', startedAt: null, finishedAt: null },
        });
        await this.prisma.killerAssignment.deleteMany({ where: { gameId } });
        await this.prisma.eliminationRequest.deleteMany({ where: { gameId } });
        this.events.emitKillerUpdate({ type: 'game_reset', gameId });
        return { message: 'Partie réinitialisée' };
    }
};
exports.KillerService = KillerService;
exports.KillerService = KillerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], KillerService);
//# sourceMappingURL=killer.service.js.map