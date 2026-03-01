export declare class OrderItemResponse {
    id: number;
    menuItemId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}
export declare class OrderResponse {
    id: number;
    userId: number;
    restaurantId: number;
    orderStatus: string;
    totalAmount: number;
    items: OrderItemResponse[];
}
