import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '@prisma/client';

@ObjectType()
export class UserResponse {
    @Field(() => Int)
    id: number;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field()
    isActive: boolean;

    @Field(() => Int)
    roleId: number;

    @Field(() => Int)
    countryId: number;
}
