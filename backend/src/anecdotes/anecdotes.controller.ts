// src/anecdotes/anecdotes.controller.ts
import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AnecdotesService } from './anecdotes.service';
import { CreateAnecdoteDto } from './dto/anecdote.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('anecdotes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnecdotesController {
  constructor(private anecdotesService: AnecdotesService) {}

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateAnecdoteDto) {
    return this.anecdotesService.create(user.sub, dto);
  }

  @Get('me')
  findMine(@CurrentUser() user: { sub: string }) {
    return this.anecdotesService.findMine(user.sub);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.anecdotesService.findAll();
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.anecdotesService.delete(id, user.sub);
  }
}