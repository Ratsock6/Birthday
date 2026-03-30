import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFoodRestrictionDto } from './dto/food-restriction.dto';

@Injectable()
export class FoodRestrictionsService {
  constructor(private prisma: PrismaService) {}

  async getMyRestriction(userId: string) {
    return this.prisma.foodRestriction.findUnique({ where: { userId } });
  }

  async upsertRestriction(userId: string, dto: UpdateFoodRestrictionDto) {
    return this.prisma.foodRestriction.upsert({
      where: { userId },
      update: dto,
      create: { ...dto, userId },
    });
  }

  async getAllRestrictions() {
    return this.prisma.foodRestriction.findMany({
      include: {
        user: { select: { id: true, displayName: true, username: true } },
      },
      orderBy: { user: { displayName: 'asc' } },
    });
  }
}