import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateMenuItemInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Float)
    price: number;

    @Field(() => Int)
    restaurantId: number;
}
