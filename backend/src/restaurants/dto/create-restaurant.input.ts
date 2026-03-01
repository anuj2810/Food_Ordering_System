import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateRestaurantInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    address: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field(() => Int)
    countryId: number;
}
