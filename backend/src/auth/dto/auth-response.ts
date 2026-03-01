import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '@prisma/client';

@ObjectType()
class BaseUserResponse {
    @Field()
    id: number;

    @Field()
    email: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    roleId: number;

    @Field()
    countryId: number;
}

@ObjectType()
export class AuthResponse {
    @Field()
    accessToken: string;

    @Field(() => BaseUserResponse)
    user: BaseUserResponse;
}
