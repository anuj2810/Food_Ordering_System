import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PaymentMethodResponse {
    @Field(() => Int)
    id: number;

    @Field()
    methodName: string;

    @Field()
    provider: string;

    @Field({ nullable: true })
    token?: string;

    @Field(() => Boolean)
    isActive: boolean;

    @Field(() => Int)
    userId: number;
}
