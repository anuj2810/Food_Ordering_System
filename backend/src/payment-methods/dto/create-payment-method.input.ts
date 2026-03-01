import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePaymentMethodInput {
    @Field()
    methodName: string;

    @Field()
    provider: string;

    @Field({ nullable: true })
    token?: string;
}
