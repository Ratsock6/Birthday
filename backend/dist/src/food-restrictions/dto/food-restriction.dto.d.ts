import { DietType } from '@prisma/client';
export declare class UpdateFoodRestrictionDto {
    diet?: DietType;
    allergies?: string[];
    details?: string;
}
