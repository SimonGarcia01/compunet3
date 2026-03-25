import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from '../role/role.entity';

import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role])],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
