import { MenuItemResponse } from './menu/menu-item-response';
export declare class RestaurantResponse {
    id: number;
    name: string;
    description?: string;
    address: string;
    phoneNumber?: string;
    isActive: boolean;
    countryId: number;
    menuItems?: MenuItemResponse[];
}
