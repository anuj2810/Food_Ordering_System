import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';
import { Order } from '@prisma/client';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(userId: number, input: CreateOrderInput): Promise<Order>;
    getOrdersByUser(userId: number): Promise<Order[]>;
    getAllOrders(): Promise<Order[]>;
    getOrdersByCountry(countryId: number): Promise<Order[]>;
    updateOrderStatus(orderId: number, status: any): Promise<Order>;
    cancelOrder(orderId: number, userId: number, roleId: number, countryId: number): Promise<Order>;
}
