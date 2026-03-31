import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRsvpDto } from './dto/rsvp.dto';

@Injectable()
export class RsvpService {
  constructor(private prisma: PrismaService) {}

  async getMyRsvp(userId: string) {
    return this.prisma.rsvp.findUnique({
      where: { userId },
      include: { user: { select: { displayName: true } } },
    });
  }

  async upsertRsvp(userId: string, dto: UpdateRsvpDto) {
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
}