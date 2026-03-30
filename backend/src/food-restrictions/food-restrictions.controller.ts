import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { FoodRestrictionsService } from './food-restrictions.service';
import { UpdateFoodRestrictionDto } from './dto/food-restriction.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('food')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FoodRestrictionsController {
  constructor(private foodService: FoodRestrictionsService) {}

  @Get('me')
  getMyRestriction(@CurrentUser() user: { sub: string }) {
    return this.foodService.getMyRestriction(user.sub);
  }

  @Put('me')
  upsertRestriction(
    @CurrentUser() user: { sub: string },
    @Body() dto: UpdateFoodRestrictionDto,
  ) {
    return this.foodService.upsertRestriction(user.sub, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  getAllRestrictions() {
    return this.foodService.getAllRestrictions();
  }
}