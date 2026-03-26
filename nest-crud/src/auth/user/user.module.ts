import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleModule } from '../role/role.module';

import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
    //Since the RoleModule has the RoleRepository imported, you can just import the RoleModule which has the service and repository
    imports: [TypeOrmModule.forFeature([User]), RoleModule],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
