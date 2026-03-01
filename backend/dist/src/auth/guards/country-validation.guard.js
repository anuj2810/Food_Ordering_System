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
exports.CountryValidationGuard = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const prisma_service_1 = require("../../prisma/prisma.service");
let CountryValidationGuard = class CountryValidationGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const ctx = graphql_1.GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('User authentication required for country validation.');
        }
        const args = ctx.getArgs();
        if (args.restaurantId) {
            const restaurant = await this.prisma.restaurant.findUnique({
                where: { id: args.restaurantId },
            });
            if (!restaurant) {
                throw new common_1.ForbiddenException('Restaurant not found.');
            }
            if (user.countryId !== restaurant.countryId) {
                throw new common_1.ForbiddenException('Country access restricted. You can only interact with restaurants in your registered country.');
            }
        }
        return true;
    }
};
exports.CountryValidationGuard = CountryValidationGuard;
exports.CountryValidationGuard = CountryValidationGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CountryValidationGuard);
//# sourceMappingURL=country-validation.guard.js.map