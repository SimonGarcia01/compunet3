import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttendanceSuppSessionService } from './attendance-supp-session.service';
import { AttendanceSuppSessionController } from './attendance-supp-session.controller';
import { AttendanceSuppSession } from './entities/attendance-supp-session.entity';
import { User } from 'src/auth/user/entities/user.entity';
import { SupplementarySession } from '../supplementary-sessions/entities/supplementary-session.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AttendanceSuppSession, User, SupplementarySession])],
    controllers: [AttendanceSuppSessionController],
    providers: [AttendanceSuppSessionService],
})
export class AttendanceSuppSessionModule {}
