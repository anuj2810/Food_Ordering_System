import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserInput } from './dto/register-user.input';
import { User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findAllUsers(): Promise<User[]>;
    createUser(input: RegisterUserInput): Promise<User>;
}
