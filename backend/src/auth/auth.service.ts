import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterUserInput } from '../users/dto/register-user.input';
import { LoginUserInput } from '../users/dto/login-user.input';
import { comparePassword } from '../utils/password.util';
import { AuthResponse } from './dto/auth-response';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await comparePassword(pass, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }

    async login(loginUserInput: LoginUserInput): Promise<AuthResponse> {
        const user = await this.validateUser(loginUserInput.email, loginUserInput.password);
        return this.generateTokenResponse(user);
    }

    async register(registerUserInput: RegisterUserInput): Promise<AuthResponse> {
        const user = await this.usersService.createUser(registerUserInput);
        return this.generateTokenResponse(user);
    }

    private generateTokenResponse(user: User): AuthResponse {
        const payload = { sub: user.id, email: user.email, role: user.roleId, country: user.countryId };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roleId: user.roleId,
                countryId: user.countryId,
            },
        };
    }
}
