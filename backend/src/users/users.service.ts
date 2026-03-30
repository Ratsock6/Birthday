import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        createdAt: true,
        rsvp: { select: { status: true } },
      },
      orderBy: { displayName: 'asc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        createdAt: true,
        rsvp: true,
        foodRestriction: true,
      },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async findMe(userId: string) {
    return this.findOne(userId);
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existing) throw new ConflictException('Ce username est déjà pris');

    const password = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: { ...dto, password },
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: 'Utilisateur supprimé' };
  }
}