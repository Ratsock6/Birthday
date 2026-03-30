import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWallMessageDto } from './dto/wall.dto';

@Injectable()
export class WallService {
  constructor(private prisma: PrismaService) {}

  async getMessages(onlyApproved = true) {
    return this.prisma.wallMessage.findMany({
      where: onlyApproved ? { approved: true } : {},
      include: {
        user: { select: { id: true, displayName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createMessage(userId: string, dto: CreateWallMessageDto) {
    return this.prisma.wallMessage.create({
      data: {
        content: dto.content,
        userId,
        approved: true, // passe à false si tu veux modération manuelle
      },
      include: {
        user: { select: { id: true, displayName: true } },
      },
    });
  }

  async approveMessage(id: string) {
    const msg = await this.prisma.wallMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException('Message introuvable');
    return this.prisma.wallMessage.update({
      where: { id },
      data: { approved: true },
      include: { user: { select: { id: true, displayName: true } } },
    });
  }

  async deleteMessage(id: string, userId: string, isAdmin: boolean) {
    const msg = await this.prisma.wallMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException('Message introuvable');
    if (!isAdmin && msg.userId !== userId) {
      throw new ForbiddenException('Non autorisé');
    }
    await this.prisma.wallMessage.delete({ where: { id } });
    return { message: 'Message supprimé' };
  }

  async likeMessage(id: string) {
    const msg = await this.prisma.wallMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException('Message introuvable');
    return this.prisma.wallMessage.update({
      where: { id },
      data: { likes: { increment: 1 } },
      include: { user: { select: { id: true, displayName: true } } },
    });
  }
}