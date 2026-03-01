import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantInput } from './dto/create-restaurant.input';
import { CreateMenuItemInput } from './dto/menu/create-menu-item.input';
import { Restaurant, MenuItem } from '@prisma/client';

@Injectable()
export class RestaurantsService {
    constructor(private prisma: PrismaService) { }

    async createRestaurant(input: CreateRestaurantInput): Promise<Restaurant> {
        return this.prisma.restaurant.create({
            data: {
                name: input.name,
                description: input.description,
                address: input.address,
                phoneNumber: input.phoneNumber,
                countryId: input.countryId,
            },
        });
    }

    async findAllRestaurants(): Promise<Restaurant[]> {
        return this.prisma.restaurant.findMany({
            include: { menuItems: true }
        });
    }

    async addMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
        return this.prisma.menuItem.create({
            data: {
                name: input.name,
                description: input.description,
                price: input.price,
                restaurantId: input.restaurantId,
            }
        });
    }
}

