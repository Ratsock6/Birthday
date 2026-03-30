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
exports.RsvpService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RsvpService = class RsvpService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyRsvp(userId) {
        return this.prisma.rsvp.findUnique({
            where: { userId },
            include: { user: { select: { displayName: true } } },
        });
    }
    async upsertRsvp(userId, dto) {
        return this.prisma.rsvp.upsert({
            where: { userId },
            update: dto,
            create: { ...dto, userId },
        });
    }
    async getAllRsvp() {
        const [rsvps, total] = await Promise.all([
            this.prisma.rsvp.findMany({
                include: { user: { select: { id: true, displayName: true, username: true } } },
                orderBy: { updatedAt: 'desc' },
            }),
            this.prisma.user.count({ where: { role: 'GUEST' } }),
        ]);
        const stats = {
            total,
            confirmed: rsvps.filter(r => r.status === 'CONFIRMED').length,
            declined: rsvps.filter(r => r.status === 'DECLINED').length,
            maybe: rsvps.filter(r => r.status === 'MAYBE').length,
            pending: total - rsvps.length,
        };
        return { rsvps, stats };
    }
};
exports.RsvpService = RsvpService;
exports.RsvpService = RsvpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RsvpService);
//# sourceMappingURL=rsvp.service.js.map