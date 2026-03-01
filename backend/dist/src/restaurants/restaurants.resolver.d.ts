import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantInput } from './dto/create-restaurant.input';
import { CreateMenuItemInput } from './dto/menu/create-menu-item.input';
export declare class RestaurantsResolver {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    findAll(): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phoneNumber: string | null;
        countryId: number;
        isActive: boolean;
        address: string;
    }[]>;
    createRestaurant(createRestaurantInput: CreateRestaurantInput): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phoneNumber: string | null;
        countryId: number;
        isActive: boolean;
        address: string;
    }>;
    addMenuItem(createMenuItemInput: CreateMenuItemInput): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: number;
        restaurantId: number;
        isAvailable: boolean;
    }>;
}
