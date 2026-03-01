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
exports.RestaurantsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const restaurants_service_1 = require("./restaurants.service");
const restaurant_response_1 = require("./dto/restaurant-response");
const create_restaurant_input_1 = require("./dto/create-restaurant.input");
const menu_item_response_1 = require("./dto/menu/menu-item-response");
const create_menu_item_input_1 = require("./dto/menu/create-menu-item.input");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let RestaurantsResolver = class RestaurantsResolver {
    restaurantsService;
    constructor(restaurantsService) {
        this.restaurantsService = restaurantsService;
    }
    async findAll() {
        return this.restaurantsService.findAllRestaurants();
    }
    async createRestaurant(createRestaurantInput) {
        return this.restaurantsService.createRestaurant(createRestaurantInput);
    }
    async addMenuItem(createMenuItemInput) {
        return this.restaurantsService.addMenuItem(createMenuItemInput);
    }
};
exports.RestaurantsResolver = RestaurantsResolver;
__decorate([
    (0, graphql_1.Query)(() => [restaurant_response_1.RestaurantResponse], { name: 'restaurants' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RestaurantsResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Mutation)(() => restaurant_response_1.RestaurantResponse),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, graphql_1.Args)('createRestaurantInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_restaurant_input_1.CreateRestaurantInput]),
    __metadata("design:returntype", Promise)
], RestaurantsResolver.prototype, "createRestaurant", null);
__decorate([
    (0, graphql_1.Mutation)(() => menu_item_response_1.MenuItemResponse),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, graphql_1.Args)('createMenuItemInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_item_input_1.CreateMenuItemInput]),
    __metadata("design:returntype", Promise)
], RestaurantsResolver.prototype, "addMenuItem", null);
exports.RestaurantsResolver = RestaurantsResolver = __decorate([
    (0, graphql_1.Resolver)(() => restaurant_response_1.RestaurantResponse),
    __metadata("design:paramtypes", [restaurants_service_1.RestaurantsService])
], RestaurantsResolver);
//# sourceMappingURL=restaurants.resolver.js.map