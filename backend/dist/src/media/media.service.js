"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const events_gateway_1 = require("../websocket/events/events.gateway");
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let MediaService = class MediaService {
    prisma;
    events;
    constructor(prisma, events) {
        this.prisma = prisma;
        this.events = events;
    }
    async findAll(onlyApproved = true) {
        return this.prisma.media.findMany({
            where: onlyApproved ? { approved: true } : {},
            include: {
                user: { select: { id: true, displayName: true } },
            },
            orderBy: { uploadedAt: 'desc' },
        });
    }
    async upload(userId, file) {
        const isVideo = file.mimetype.startsWith('video/');
        const media = await this.prisma.media.create({
            data: {
                filename: file.filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                type: isVideo ? client_1.MediaType.VIDEO : client_1.MediaType.PHOTO,
                url: `/uploads/${file.filename}`,
                approved: true,
                userId,
            },
            include: {
                user: { select: { id: true, displayName: true } },
            },
        });
        if (media.approved) {
            this.events.emitNewMedia(media);
        }
        return media;
    }
    async approve(id) {
        const media = await this.prisma.media.findUnique({ where: { id } });
        if (!media)
            throw new common_1.NotFoundException('Média introuvable');
        const updated = await this.prisma.media.update({
            where: { id },
            data: { approved: true },
            include: { user: { select: { id: true, displayName: true } } },
        });
        this.events.emitNewMedia(updated);
        return updated;
    }
    async remove(id, userId, isAdmin) {
        const media = await this.prisma.media.findUnique({ where: { id } });
        if (!media)
            throw new common_1.NotFoundException('Média introuvable');
        if (!isAdmin && media.userId !== userId) {
            throw new common_1.ForbiddenException('Non autorisé');
        }
        const filePath = path.join(process.cwd(), 'uploads', media.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        await this.prisma.media.delete({ where: { id } });
        return { message: 'Média supprimé' };
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], MediaService);
//# sourceMappingURL=media.service.js.map