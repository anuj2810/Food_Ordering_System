import { OrdersService } from './orders.service';
import { CreateOrderInput } from './dto/create-order.input';
export declare class OrdersResolver {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(user: any, createOrderInput: CreateOrderInput): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: number;
        orderStatus: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        userId: number;
    }>;
    getMyOrders(user: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: number;
        orderStatus: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        userId: number;
    }[]>;
    getAllOrders(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: number;
        orderStatus: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        userId: number;
    }[]>;
    getAssignedOrders(user: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: number;
        orderStatus: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        userId: number;
    }[]>;
    updateOrderStatus(orderId: number, status: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: number;
        orderStatus: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        userId: number;
    }>;
    cancelOrder(orderId: number, user: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: number;
        orderStatus: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        userId: number;
    }>;
}
