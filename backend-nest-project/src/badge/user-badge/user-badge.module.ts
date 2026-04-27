import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserBadgeService } from './user-badge.service';
import { UserBadgeController } from './user-badge.controller';
import { UserBadge } from './entities/user-badge.entity';
import { User } from 'src/auth/user/entities/user.entity';
import { ExperienceBadge } from 'src/badge/experience-badge/entities/experience-badge.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserBadge, User, ExperienceBadge])],
    controllers: [UserBadgeController],
    providers: [UserBadgeService],
    exports: [UserBadgeService],
})
export class UserBadgeModule {}
