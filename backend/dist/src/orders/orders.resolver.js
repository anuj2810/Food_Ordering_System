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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const orders_service_1 = require("./orders.service");
const order_response_1 = require("./dto/order-response");
const create_order_input_1 = require("./dto/create-order.input");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let OrdersResolver = class OrdersResolver {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async createOrder(user, createOrderInput) {
        return this.ordersService.createOrder(user.userId, createOrderInput);
    }
    async getMyOrders(user) {
        return this.ordersService.getOrdersByUser(user.userId);
    }
    async getAllOrders() {
        return this.ordersService.getAllOrders();
    }
    async getAssignedOrders(user) {
        return this.ordersService.getOrdersByCountry(user.countryId);
    }
    async updateOrderStatus(orderId, status) {
        return this.ordersService.updateOrderStatus(orderId, status);
    }
    async cancelOrder(orderId, user) {
        return this.ordersService.cancelOrder(orderId, user.userId, user.roleId, user.countryId);
    }
};
exports.OrdersResolver = OrdersResolver;
__decorate([
    (0, graphql_1.Mutation)(() => order_response_1.OrderResponse),
    (0, roles_decorator_1.Roles)('MEMBER', 'ADMIN'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('createOrderInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_input_1.CreateOrderInput]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "createOrder", null);
__decorate([
    (0, graphql_1.Query)(() => [order_response_1.OrderResponse], { name: 'myOrders' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "getMyOrders", null);
__decorate([
    (0, graphql_1.Query)(() => [order_response_1.OrderResponse], { name: 'allOrders' }),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "getAllOrders", null);
__decorate([
    (0, graphql_1.Query)(() => [order_response_1.OrderResponse], { name: 'assignedOrders' }),
    (0, roles_decorator_1.Roles)('MANAGER'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "getAssignedOrders", null);
__decorate([
    (0, graphql_1.Mutation)(() => order_response_1.OrderResponse),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, graphql_1.Args)('orderId', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "updateOrderStatus", null);
__decorate([
    (0, graphql_1.Mutation)(() => order_response_1.OrderResponse),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER', 'MEMBER'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, graphql_1.Args)('orderId', { type: () => graphql_1.Int })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "cancelOrder", null);
exports.OrdersResolver = OrdersResolver = __decorate([
    (0, graphql_1.Resolver)(() => order_response_1.OrderResponse),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersResolver);
//# sourceMappingURL=orders.resolver.js.map