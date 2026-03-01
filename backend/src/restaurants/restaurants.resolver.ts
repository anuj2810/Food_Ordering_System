import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RestaurantsService } from './restaurants.service';
import { RestaurantResponse } from './dto/restaurant-response';
import { CreateRestaurantInput } from './dto/create-restaurant.input';
import { MenuItemResponse } from './dto/menu/menu-item-response';
import { CreateMenuItemInput } from './dto/menu/create-menu-item.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => RestaurantResponse)
export class RestaurantsResolver {
    constructor(private readonly restaurantsService: RestaurantsService) { }

    @Query(() => [RestaurantResponse], { name: 'restaurants' })
    @UseGuards(JwtAuthGuard)
    async findAll() {
        return this.restaurantsService.findAllRestaurants();
    }

    @Mutation(() => RestaurantResponse)
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createRestaurant(
        @Args('createRestaurantInput') createRestaurantInput: CreateRestaurantInput,
    ) {
        return this.restaurantsService.createRestaurant(createRestaurantInput);
    }

    @Mutation(() => MenuItemResponse)
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async addMenuItem(
        @Args('createMenuItemInput') createMenuItemInput: CreateMenuItemInput,
    ) {
        return this.restaurantsService.addMenuItem(createMenuItemInput);
    }
}
