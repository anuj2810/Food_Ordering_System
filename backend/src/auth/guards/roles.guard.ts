import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const ctx = GqlExecutionContext.create(context);
        const { user } = ctx.getContext().req;

        if (!user) {
            throw new ForbiddenException('No user attached to request');
        }

        const dbRole = await this.prisma.role.findUnique({
            where: { id: user.roleId },
        });

        if (!dbRole) {
            throw new ForbiddenException('Invalid user role');
        }

        const hasRole = requiredRoles.includes(dbRole.roleName);
        if (!hasRole) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}
