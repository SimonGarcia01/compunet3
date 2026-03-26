import { PartialType } from '@nestjs/mapped-types';

import { UserInputNameRole } from './createUser.dto';

export class UpdateUserDto extends PartialType(UserInputNameRole) {}
