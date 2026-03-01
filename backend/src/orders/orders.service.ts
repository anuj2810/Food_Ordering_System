import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async createOrder(userId: number, input: CreateOrderInput): Promise<Order> {
        if (!input.items || input.items.length === 0) {
            throw new BadRequestException('Order must contain at least one item');
        }

        // Extract all menu item IDs
        const itemIds = input.items.map(item => item.menuItemId);

        // Fetch actual menu items from DB to get their current prices
        const menuItems = await this.prisma.menuItem.findMany({
            where: {
                id: { in: itemIds },
                restaurantId: input.restaurantId,
                isAvailable: true,
            },
        });

        if (menuItems.length !== itemIds.length) {
            throw new BadRequestException('One or more selected items are unavailable or do not belong to this restaurant.');
        }

        // Map prices
        const itemPriceMap = new Map(menuItems.map(item => [item.id, Number(item.price)]));

        // Calculate total price accurately
        let totalAmount = 0;
        const itemsData = input.items.map(item => {
            const price = itemPriceMap.get(item.menuItemId) || 0;
            totalAmount += price * item.quantity;
            return {
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                unitPrice: price,
                subtotal: price * item.quantity,
            };
        });

        // Create Order inside a transaction
        return this.prisma.order.create({
            data: {
                userId,
                restaurantId: input.restaurantId,
                totalAmount,
                orderStatus: 'CREATED',
                items: {
                    create: itemsData,
                },
            },
            include: {
                items: true,
            },
        });
    }

    async getOrdersByUser(userId: number): Promise<Order[]> {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: true },
        });
    }

    async getAllOrders(): Promise<Order[]> {
        return this.prisma.order.findMany({
            include: { items: true },
        });
    }

    async getOrdersByCountry(countryId: number): Promise<Order[]> {
        return this.prisma.order.findMany({
            where: {
                restaurant: { countryId }
            },
            include: { items: true },
        });
    }

    // Use string type and prisma enum cast or just any for status for simplicity in this implementation
    async updateOrderStatus(orderId: number, status: any): Promise<Order> {
        return this.prisma.order.update({
            where: { id: orderId },
            data: { orderStatus: status },
            include: { items: true },
        });
    }

    async cancelOrder(orderId: number, userId: number, roleId: number, countryId: number): Promise<Order> {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { restaurant: true },
        });

        if (!order) {
            throw new BadRequestException('Order not found');
        }

        const role = await this.prisma.role.findUnique({ where: { id: roleId } });
        const roleName = role?.roleName || 'UNKNOWN';

        if (roleName === 'MEMBER' && order.userId !== userId) {
            throw new BadRequestException('You do not have permission to cancel this order');
        }

        if (roleName === 'MANAGER' && order.restaurant.countryId !== countryId) {
            throw new BadRequestException('You do not have permission to cancel orders outside your region');
        }

        return this.prisma.order.update({
            where: { id: orderId },
            data: { orderStatus: 'CANCELLED' },
            include: { items: true },
        });
    }
}
