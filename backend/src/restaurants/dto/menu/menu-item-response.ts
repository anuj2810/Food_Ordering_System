import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class MenuItemResponse {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Float)
    price: number;

    @Field()
    isAvailable: boolean;

    @Field(() => Int)
    restaurantId: number;
}
