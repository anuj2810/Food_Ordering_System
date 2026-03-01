import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class OrderItemResponse {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    menuItemId: number;

    @Field(() => Int)
    quantity: number;

    @Field(() => Float)
    unitPrice: number;

    @Field(() => Float)
    subtotal: number;
}

@ObjectType()
export class OrderResponse {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    userId: number;

    @Field(() => Int)
    restaurantId: number;

    @Field()
    orderStatus: string;

    @Field(() => Float)
    totalAmount: number;

    @Field(() => [OrderItemResponse])
    items: OrderItemResponse[];
}
