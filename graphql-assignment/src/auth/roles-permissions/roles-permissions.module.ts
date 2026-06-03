import { Module } from '@nestjs/common';
import { RolesPermissionsService } from './roles-permissions.service';
import { RolesPermissionsResolver } from './roles-permissions.resolver';

@Module({
  providers: [RolesPermissionsResolver, RolesPermissionsService],
})
export class RolesPermissionsModule {}
