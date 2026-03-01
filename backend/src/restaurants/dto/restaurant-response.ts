import { ObjectType, Field, Int } from '@nestjs/graphql';
import { MenuItemResponse } from './menu/menu-item-response';

@ObjectType()
export class RestaurantResponse {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    address: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field()
    isActive: boolean;

    @Field(() => Int)
    countryId: number;

    @Field(() => [MenuItemResponse], { nullable: true })
    menuItems?: MenuItemResponse[];
}
