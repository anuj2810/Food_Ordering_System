import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserInput } from './dto/register-user.input';
import { hashPassword } from '../utils/password.util';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findAllUsers(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async createUser(input: RegisterUserInput): Promise<User> {
        const passwordHash = await hashPassword(input.password);
        return this.prisma.user.create({
            data: {
                firstName: input.firstName,
                lastName: input.lastName,
                email: input.email,
                phoneNumber: input.phoneNumber,
                passwordHash,
                roleId: input.roleId,
                countryId: input.countryId,
            },
        });
    }
}

