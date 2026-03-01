import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response';
import { LoginUserInput } from '../users/dto/login-user.input';
import { RegisterUserInput } from '../users/dto/register-user.input';
export declare class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginUserInput: LoginUserInput): Promise<AuthResponse>;
    register(registerUserInput: RegisterUserInput): Promise<AuthResponse>;
}
