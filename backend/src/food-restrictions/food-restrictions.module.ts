import { Module } from '@nestjs/common';
import { FoodRestrictionsService } from './food-restrictions.service';
import { FoodRestrictionsController } from './food-restrictions.controller';

@Module({
  controllers: [FoodRestrictionsController],
  providers: [FoodRestrictionsService],
})
export class FoodRestrictionsModule {}