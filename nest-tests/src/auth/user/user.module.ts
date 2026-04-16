import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '@/common/logger/logger.module';

import { User } from '../entities/user.entity';
import { RoleModule } from '../role/role.module';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [TypeOrmModule.forFeature([User]), RoleModule, LoggerModule],
    exports: [UserService],
})
export class UserModule {}
