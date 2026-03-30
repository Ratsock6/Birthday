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
exports.WallService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WallService = class WallService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMessages(onlyApproved = true) {
        return this.prisma.wallMessage.findMany({
            where: onlyApproved ? { approved: true } : {},
            include: {
                user: { select: { id: true, displayName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createMessage(userId, dto) {
        return this.prisma.wallMessage.create({
            data: {
                content: dto.content,
                userId,
                approved: true,
            },
            include: {
                user: { select: { id: true, displayName: true } },
            },
        });
    }
    async approveMessage(id) {
        const msg = await this.prisma.wallMessage.findUnique({ where: { id } });
        if (!msg)
            throw new common_1.NotFoundException('Message introuvable');
        return this.prisma.wallMessage.update({
            where: { id },
            data: { approved: true },
            include: { user: { select: { id: true, displayName: true } } },
        });
    }
    async deleteMessage(id, userId, isAdmin) {
        const msg = await this.prisma.wallMessage.findUnique({ where: { id } });
        if (!msg)
            throw new common_1.NotFoundException('Message introuvable');
        if (!isAdmin && msg.userId !== userId) {
            throw new common_1.ForbiddenException('Non autorisé');
        }
        await this.prisma.wallMessage.delete({ where: { id } });
        return { message: 'Message supprimé' };
    }
    async likeMessage(id) {
        const msg = await this.prisma.wallMessage.findUnique({ where: { id } });
        if (!msg)
            throw new common_1.NotFoundException('Message introuvable');
        return this.prisma.wallMessage.update({
            where: { id },
            data: { likes: { increment: 1 } },
            include: { user: { select: { id: true, displayName: true } } },
        });
    }
};
exports.WallService = WallService;
exports.WallService = WallService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WallService);
//# sourceMappingURL=wall.service.js.map