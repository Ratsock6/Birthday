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
exports.AnecdotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnecdotesService = class AnecdotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.anecdote.create({
            data: { ...dto, userId },
            include: { user: { select: { id: true, displayName: true } } },
        });
    }
    async findMine(userId) {
        return this.prisma.anecdote.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAll() {
        const anecdotes = await this.prisma.anecdote.findMany({
            include: { user: { select: { id: true, displayName: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return anecdotes.sort(() => Math.random() - 0.5);
    }
    async delete(id, userId) {
        await this.prisma.anecdote.delete({ where: { id } });
        return { message: 'Anecdote supprimée' };
    }
};
exports.AnecdotesService = AnecdotesService;
exports.AnecdotesService = AnecdotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnecdotesService);
//# sourceMappingURL=anecdotes.service.js.map