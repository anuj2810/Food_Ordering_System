import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { OrderResponse } from './dto/order-response';
import { CreateOrderInput } from './dto/create-order.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => OrderResponse)
export class OrdersResolver {
    constructor(private readonly ordersService: OrdersService) { }

    @Mutation(() => OrderResponse)
    @Roles('MEMBER', 'ADMIN') // Roles allowed to order
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createOrder(
        @CurrentUser() user: any,
        @Args('createOrderInput') createOrderInput: CreateOrderInput,
    ) {
        return this.ordersService.createOrder(user.userId, createOrderInput);
    }

    @Query(() => [OrderResponse], { name: 'myOrders' })
    @UseGuards(JwtAuthGuard)
    async getMyOrders(@CurrentUser() user: any) {
        return this.ordersService.getOrdersByUser(user.userId);
    }

    @Query(() => [OrderResponse], { name: 'allOrders' })
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getAllOrders() {
        return this.ordersService.getAllOrders();
    }

    @Query(() => [OrderResponse], { name: 'assignedOrders' })
    @Roles('MANAGER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getAssignedOrders(@CurrentUser() user: any) {
        return this.ordersService.getOrdersByCountry(user.countryId);
    }

    @Mutation(() => OrderResponse)
    @Roles('ADMIN', 'MANAGER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateOrderStatus(
        @Args('orderId', { type: () => Int }) orderId: number,
        @Args('status') status: string,
    ) {
        return this.ordersService.updateOrderStatus(orderId, status);
    }

    @Mutation(() => OrderResponse)
    @Roles('ADMIN', 'MANAGER', 'MEMBER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async cancelOrder(
        @Args('orderId', { type: () => Int }) orderId: number,
        @CurrentUser() user: any,
    ) {
        return this.ordersService.cancelOrder(orderId, user.userId, user.roleId, user.countryId);
    }
}
