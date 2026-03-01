import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantInput } from './dto/create-restaurant.input';
import { CreateMenuItemInput } from './dto/menu/create-menu-item.input';
import { Restaurant, MenuItem } from '@prisma/client';
export declare class RestaurantsService {
    private prisma;
    constructor(prisma: PrismaService);
    createRestaurant(input: CreateRestaurantInput): Promise<Restaurant>;
    findAllRestaurants(): Promise<Restaurant[]>;
    addMenuItem(input: CreateMenuItemInput): Promise<MenuItem>;
}
