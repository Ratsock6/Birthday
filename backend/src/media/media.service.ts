import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../websocket/events/events.gateway';
import { MediaType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private events: EventsGateway,
  ) {}

  async findAll(onlyApproved = true) {
    return this.prisma.media.findMany({
      where: onlyApproved ? { approved: true } : {},
      include: {
        user: { select: { id: true, displayName: true } },
      },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async upload(userId: string, file: Express.Multer.File) {
    const isVideo = file.mimetype.startsWith('video/');

    const media = await this.prisma.media.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        type: isVideo ? MediaType.VIDEO : MediaType.PHOTO,
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

  async approve(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Média introuvable');

    const updated = await this.prisma.media.update({
      where: { id },
      data: { approved: true },
      include: { user: { select: { id: true, displayName: true } } },
    });

    this.events.emitNewMedia(updated);
    return updated;
  }

  async remove(id: string, userId: string, isAdmin: boolean) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Média introuvable');
    if (!isAdmin && media.userId !== userId) {
      throw new ForbiddenException('Non autorisé');
    }

    // Supprime le fichier physique
    const filePath = path.join(process.cwd(), 'uploads', media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.prisma.media.delete({ where: { id } });
    return { message: 'Média supprimé' };
  }
}