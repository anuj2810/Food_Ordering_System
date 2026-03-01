import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterUserInput } from '../users/dto/register-user.input';
import { LoginUserInput } from '../users/dto/login-user.input';
import { AuthResponse } from './dto/auth-response';
import { User } from '@prisma/client';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<User>;
    login(loginUserInput: LoginUserInput): Promise<AuthResponse>;
    register(registerUserInput: RegisterUserInput): Promise<AuthResponse>;
    private generateTokenResponse;
}
