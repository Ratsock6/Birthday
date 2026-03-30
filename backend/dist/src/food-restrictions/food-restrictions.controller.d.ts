import { FoodRestrictionsService } from './food-restrictions.service';
import { UpdateFoodRestrictionDto } from './dto/food-restriction.dto';
export declare class FoodRestrictionsController {
    private foodService;
    constructor(foodService: FoodRestrictionsService);
    getMyRestriction(user: {
        sub: string;
    }): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        diet: import("@prisma/client").$Enums.DietType;
        allergies: string[];
        details: string | null;
    } | null>;
    upsertRestriction(user: {
        sub: string;
    }, dto: UpdateFoodRestrictionDto): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        diet: import("@prisma/client").$Enums.DietType;
        allergies: string[];
        details: string | null;
    }>;
    getAllRestrictions(): Promise<({
        user: {
            id: string;
            username: string;
            displayName: string;
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        diet: import("@prisma/client").$Enums.DietType;
        allergies: string[];
        details: string | null;
    })[]>;
}
