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
exports.RestaurantResponse = void 0;
const graphql_1 = require("@nestjs/graphql");
const menu_item_response_1 = require("./menu/menu-item-response");
let RestaurantResponse = class RestaurantResponse {
    id;
    name;
    description;
    address;
    phoneNumber;
    isActive;
    countryId;
    menuItems;
};
exports.RestaurantResponse = RestaurantResponse;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RestaurantResponse.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RestaurantResponse.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RestaurantResponse.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RestaurantResponse.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RestaurantResponse.prototype, "phoneNumber", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], RestaurantResponse.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RestaurantResponse.prototype, "countryId", void 0);
__decorate([
    (0, graphql_1.Field)(() => [menu_item_response_1.MenuItemResponse], { nullable: true }),
    __metadata("design:type", Array)
], RestaurantResponse.prototype, "menuItems", void 0);
exports.RestaurantResponse = RestaurantResponse = __decorate([
    (0, graphql_1.ObjectType)()
], RestaurantResponse);
//# sourceMappingURL=restaurant-response.js.map