import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CountryValidationGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('User authentication required for country validation.');
        }

        const args = ctx.getArgs();

        // Validate if the mutation/query involves a restaurantId
        if (args.restaurantId) {
            const restaurant = await this.prisma.restaurant.findUnique({
                where: { id: args.restaurantId },
            });

            if (!restaurant) {
                throw new ForbiddenException('Restaurant not found.');
            }

            if (user.countryId !== restaurant.countryId) {
                throw new ForbiddenException('Country access restricted. You can only interact with restaurants in your registered country.');
            }
        }

        return true;
    }
}
