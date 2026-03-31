import { AuthService } from './auth.service';
import { LoginDto, RefreshDto, LogoutDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            username: string;
            displayName: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
    }>;
    logout(dto: LogoutDto): Promise<{
        message: string;
    }>;
}
