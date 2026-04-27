import { Module } from '@nestjs/common';

import { SupplementarySessionsModule } from './supplementary-sessions/supplementary-sessions.module';
import { AttendanceSuppSessionModule } from './attendance-supp-session/attendance-supp-session.module';

@Module({
    imports: [SupplementarySessionsModule, AttendanceSuppSessionModule],
})
export class SupplementarySessionModule {}
