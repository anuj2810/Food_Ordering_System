import { UsersService } from './users.service';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string | null;
        roleId: number;
        countryId: number;
        passwordHash: string;
        isActive: boolean;
    }[]>;
}
