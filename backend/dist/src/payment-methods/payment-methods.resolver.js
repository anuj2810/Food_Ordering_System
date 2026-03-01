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
exports.PaymentMethodsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const payment_methods_service_1 = require("./payment-methods.service");
const payment_method_response_1 = require("./dto/payment-method-response");
const create_payment_method_input_1 = require("./dto/create-payment-method.input");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let PaymentMethodsResolver = class PaymentMethodsResolver {
    paymentMethodsService;
    constructor(paymentMethodsService) {
        this.paymentMethodsService = paymentMethodsService;
    }
    async getMyPaymentMethods(user) {
        return this.paymentMethodsService.getPaymentMethods(user.userId);
    }
    async addPaymentMethod(createPaymentMethodInput, user) {
        return this.paymentMethodsService.addPaymentMethod(user.userId, createPaymentMethodInput);
    }
    async deletePaymentMethod(id, user) {
        return this.paymentMethodsService.deletePaymentMethod(user.userId, id);
    }
};
exports.PaymentMethodsResolver = PaymentMethodsResolver;
__decorate([
    (0, graphql_1.Query)(() => [payment_method_response_1.PaymentMethodResponse], { name: 'myPaymentMethods' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentMethodsResolver.prototype, "getMyPaymentMethods", null);
__decorate([
    (0, graphql_1.Mutation)(() => payment_method_response_1.PaymentMethodResponse),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('createPaymentMethodInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_method_input_1.CreatePaymentMethodInput, Object]),
    __metadata("design:returntype", Promise)
], PaymentMethodsResolver.prototype, "addPaymentMethod", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PaymentMethodsResolver.prototype, "deletePaymentMethod", null);
exports.PaymentMethodsResolver = PaymentMethodsResolver = __decorate([
    (0, graphql_1.Resolver)(() => payment_method_response_1.PaymentMethodResponse),
    __metadata("design:paramtypes", [payment_methods_service_1.PaymentMethodsService])
], PaymentMethodsResolver);
//# sourceMappingURL=payment-methods.resolver.js.map