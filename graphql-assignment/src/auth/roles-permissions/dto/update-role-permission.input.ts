import { CreateRolePermissionInput } from './create-role-permission.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRolePermissionInput extends PartialType(CreateRolePermissionInput) {
    @Field(() => Int)
    id: number;
}
