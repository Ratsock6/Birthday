import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getMe(user: {
        sub: string;
    }): Promise<{
        id: string;
        username: string;
        displayName: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        rsvp: {
            id: string;
            updatedAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.RsvpStatus;
            note: string | null;
        } | null;
        foodRestriction: {
            id: string;
            updatedAt: Date;
            userId: string;
            diet: import("@prisma/client").$Enums.DietType;
            allergies: string[];
            details: string | null;
        } | null;
    }>;
    findAll(): Promise<{
        id: string;
        username: string;
        displayName: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        rsvp: {
            status: import("@prisma/client").$Enums.RsvpStatus;
        } | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        username: string;
        displayName: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        rsvp: {
            id: string;
            updatedAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.RsvpStatus;
            note: string | null;
        } | null;
        foodRestriction: {
            id: string;
            updatedAt: Date;
            userId: string;
            diet: import("@prisma/client").$Enums.DietType;
            allergies: string[];
            details: string | null;
        } | null;
    }>;
    create(dto: CreateUserDto): Promise<{
        id: string;
        username: string;
        displayName: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        username: string;
        displayName: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
