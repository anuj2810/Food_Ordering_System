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
exports.OrderResponse = exports.OrderItemResponse = void 0;
const graphql_1 = require("@nestjs/graphql");
let OrderItemResponse = class OrderItemResponse {
    id;
    menuItemId;
    quantity;
    unitPrice;
    subtotal;
};
exports.OrderItemResponse = OrderItemResponse;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderItemResponse.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderItemResponse.prototype, "menuItemId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderItemResponse.prototype, "quantity", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OrderItemResponse.prototype, "unitPrice", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OrderItemResponse.prototype, "subtotal", void 0);
exports.OrderItemResponse = OrderItemResponse = __decorate([
    (0, graphql_1.ObjectType)()
], OrderItemResponse);
let OrderResponse = class OrderResponse {
    id;
    userId;
    restaurantId;
    orderStatus;
    totalAmount;
    items;
};
exports.OrderResponse = OrderResponse;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderResponse.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderResponse.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderResponse.prototype, "restaurantId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderResponse.prototype, "orderStatus", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OrderResponse.prototype, "totalAmount", void 0);
__decorate([
    (0, graphql_1.Field)(() => [OrderItemResponse]),
    __metadata("design:type", Array)
], OrderResponse.prototype, "items", void 0);
exports.OrderResponse = OrderResponse = __decorate([
    (0, graphql_1.ObjectType)()
], OrderResponse);
//# sourceMappingURL=order-response.js.map