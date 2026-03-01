import { Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserResponse } from './dto/user-response';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => UserResponse)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    @Query(() => [UserResponse], { name: 'users' })
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async findAll() {
        return this.usersService.findAllUsers();
    }
}
