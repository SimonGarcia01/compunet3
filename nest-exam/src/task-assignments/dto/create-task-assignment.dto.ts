import { IsInt, IsPositive } from 'class-validator';

export class CreateTaskAssignmentDto {
    @IsInt()
    @IsPositive()
    userId!: number;

    @IsInt()
    @IsPositive()
    taskId!: number;
}
