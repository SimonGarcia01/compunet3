import { CreateRolesPermissionInput } from './create-roles-permission.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRolesPermissionInput extends PartialType(CreateRolesPermissionInput) {
  @Field(() => Int)
  id: number;
}
