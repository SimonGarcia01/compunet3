import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { RolesPermissionsModule } from './roles-permissions/roles-permissions.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [UsersModule, PermissionsModule, RolesModule, RolesPermissionsModule],
})
export class AuthModule {}
