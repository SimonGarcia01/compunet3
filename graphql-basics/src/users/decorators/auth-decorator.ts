import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleProtected } from './role-protected.decorator';
import { GraphQlAuthGuard } from '../guards/graph-auth/graphql-auth.guard';
import { ValidRoles } from '../enums/valid-roles.enum';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
	return applyDecorators(RoleProtected(...roles), UseGuards(GraphQlAuthGuard, UserRoleGuard));
}
