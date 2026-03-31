import { PrismaService } from '../prisma/prisma.service';
import { UpdateFoodRestrictionDto } from './dto/food-restriction.dto';
export declare class FoodRestrictionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyRestriction(userId: string): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        diet: import("@prisma/client").$Enums.DietType;
        allergies: string[];
        details: string | null;
    } | null>;
    upsertRestriction(userId: string, dto: UpdateFoodRestrictionDto): Promise<{
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
