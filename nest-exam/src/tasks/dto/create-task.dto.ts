import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
    @IsString()
    @MinLength(1)
    title!: string;

    @IsString()
    @MinLength(1)
    description!: string;

    @IsEnum(TaskStatus)
    status!: TaskStatus;

    @IsInt()
    @IsPositive()
    projectId!: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    parentTaskId?: number;
}
