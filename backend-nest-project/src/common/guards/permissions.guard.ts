import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from 'src/auth/user/entities/user.entity';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Si la ruta no tiene @Permissions(...), se permite el acceso
        if (!required || required.length === 0) return true;

        const req = context.switchToHttp().getRequest<{ user?: User }>();
        const user = req.user;

        if (!user) throw new ForbiddenException('Not authenticated');

        // Aplanar todos los permisos del usuario a través de sus múltiples roles
        const userPermissions = user.usersRoles
            .flatMap((ur) => ur.role.rolesPermissions)
            .map((rp) => rp.permission.name);

        const hasAll = required.every((p) => userPermissions.includes(p as (typeof userPermissions)[number]));
        if (!hasAll) throw new ForbiddenException('Insufficient permissions');

        return true;
    }
}