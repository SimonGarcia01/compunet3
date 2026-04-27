import { PartialType } from '@nestjs/swagger';

import { CreateSupplementarySessionDto } from './create-supplementary-session.dto';

export class UpdateSupplementarySessionDto extends PartialType(CreateSupplementarySessionDto) {}
