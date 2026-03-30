import { Role } from '@prisma/client';
export declare class CreateUserDto {
    username: string;
    password: string;
    displayName: string;
    role?: Role;
}
