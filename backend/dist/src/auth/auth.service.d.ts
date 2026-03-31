import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RefreshDto, LogoutDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    login({ username, password }: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            username: string;
            displayName: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    refresh({ refreshToken }: RefreshDto): Promise<{
        accessToken: string;
    }>;
    logout({ refreshToken }: LogoutDto): Promise<{
        message: string;
    }>;
    private generateAccessToken;
    private createRefreshToken;
}
