// src/anecdotes/anecdotes.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnecdoteDto } from './dto/anecdote.dto';

@Injectable()
export class AnecdotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateAnecdoteDto) {
    return this.prisma.anecdote.create({
      data: { ...dto, userId },
      include: { user: { select: { id: true, displayName: true } } },
    });
  }

  async findMine(userId: string) {
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
    // Mélange aléatoire pour le jeu
    return anecdotes.sort(() => Math.random() - 0.5);
  }

  async delete(id: string, userId: string) {
    await this.prisma.anecdote.delete({ where: { id } });
    return { message: 'Anecdote supprimée' };
  }
}