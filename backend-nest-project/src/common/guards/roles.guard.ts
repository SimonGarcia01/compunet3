import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from 'src/auth/user/entities/user.entity';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!required || required.length === 0) return true;

        const req = context.switchToHttp().getRequest<{ user?: User }>();
        const user = req.user;

        if (!user) throw new ForbiddenException('Not authenticated');

        const userRoles = user.usersRoles.map((ur) => ur.role.name);
        const hasRole = required.some((r) => userRoles.includes(r as (typeof userRoles)[number]));

        if (!hasRole) throw new ForbiddenException('Insufficient role');
        return true;
    }
}