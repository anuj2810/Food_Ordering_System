import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class RegisterUserInput {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field()
    password: string;

    @Field(() => Int)
    roleId: number;

    @Field(() => Int)
    countryId: number;
}
