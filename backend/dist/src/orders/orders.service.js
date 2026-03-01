"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(userId, input) {
        if (!input.items || input.items.length === 0) {
            throw new common_1.BadRequestException('Order must contain at least one item');
        }
        const itemIds = input.items.map(item => item.menuItemId);
        const menuItems = await this.prisma.menuItem.findMany({
            where: {
                id: { in: itemIds },
                restaurantId: input.restaurantId,
                isAvailable: true,
            },
        });
        if (menuItems.length !== itemIds.length) {
            throw new common_1.BadRequestException('One or more selected items are unavailable or do not belong to this restaurant.');
        }
        const itemPriceMap = new Map(menuItems.map(item => [item.id, Number(item.price)]));
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
    async getOrdersByUser(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: true },
        });
    }
    async getAllOrders() {
        return this.prisma.order.findMany({
            include: { items: true },
        });
    }
    async getOrdersByCountry(countryId) {
        return this.prisma.order.findMany({
            where: {
                restaurant: { countryId }
            },
            include: { items: true },
        });
    }
    async updateOrderStatus(orderId, status) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: { orderStatus: status },
            include: { items: true },
        });
    }
    async cancelOrder(orderId, userId, roleId, countryId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { restaurant: true },
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        const role = await this.prisma.role.findUnique({ where: { id: roleId } });
        const roleName = role?.roleName || 'UNKNOWN';
        if (roleName === 'MEMBER' && order.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to cancel this order');
        }
        if (roleName === 'MANAGER' && order.restaurant.countryId !== countryId) {
            throw new common_1.BadRequestException('You do not have permission to cancel orders outside your region');
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: { orderStatus: 'CANCELLED' },
            include: { items: true },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map