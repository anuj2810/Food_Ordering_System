import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodResponse } from './dto/payment-method-response';
import { CreatePaymentMethodInput } from './dto/create-payment-method.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => PaymentMethodResponse)
export class PaymentMethodsResolver {
    constructor(private readonly paymentMethodsService: PaymentMethodsService) { }

    @Query(() => [PaymentMethodResponse], { name: 'myPaymentMethods' })
    @UseGuards(JwtAuthGuard)
    async getMyPaymentMethods(@CurrentUser() user: any) {
        return this.paymentMethodsService.getPaymentMethods(user.userId);
    }

    @Mutation(() => PaymentMethodResponse)
    @UseGuards(JwtAuthGuard)
    async addPaymentMethod(
        @Args('createPaymentMethodInput') createPaymentMethodInput: CreatePaymentMethodInput,
        @CurrentUser() user: any,
    ) {
        return this.paymentMethodsService.addPaymentMethod(user.userId, createPaymentMethodInput);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async deletePaymentMethod(
        @Args('id', { type: () => Int }) id: number,
        @CurrentUser() user: any,
    ) {
        return this.paymentMethodsService.deletePaymentMethod(user.userId, id);
    }
}
