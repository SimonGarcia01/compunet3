import { PartialType } from '@nestjs/swagger';

import { CreateExperienceBadgeDto } from './create-experience-badge.dto';

export class UpdateExperienceBadgeDto extends PartialType(CreateExperienceBadgeDto) {}
