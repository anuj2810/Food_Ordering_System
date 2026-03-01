import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response';
import { LoginUserInput } from '../users/dto/login-user.input';
import { RegisterUserInput } from '../users/dto/register-user.input';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Mutation(() => AuthResponse)
    async login(
        @Args('loginUserInput') loginUserInput: LoginUserInput,
    ): Promise<AuthResponse> {
        return this.authService.login(loginUserInput);
    }

    @Mutation(() => AuthResponse)
    async register(
        @Args('registerUserInput') registerUserInput: RegisterUserInput,
    ): Promise<AuthResponse> {
        return this.authService.register(registerUserInput);
    }
}
