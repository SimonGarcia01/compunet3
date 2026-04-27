import { PartialType } from '@nestjs/swagger';

import { CreateAttendanceSuppSessionDto } from './create-attendance-supp-session.dto';

export class UpdateAttendanceSuppSessionDto extends PartialType(CreateAttendanceSuppSessionDto) {}
