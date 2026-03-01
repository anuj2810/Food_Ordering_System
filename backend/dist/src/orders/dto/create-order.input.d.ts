export declare class OrderItemInput {
    menuItemId: number;
    quantity: number;
}
export declare class CreateOrderInput {
    restaurantId: number;
    items: OrderItemInput[];
}
