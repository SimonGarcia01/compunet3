import { Module } from '@nestjs/common';

import { ExperienceBadgeModule } from './experience-badge/experience-badge.module';
import { UserBadgeModule } from './user-badge/user-badge.module';

@Module({
    imports: [ExperienceBadgeModule, UserBadgeModule],
})
export class BadgeModule {}
