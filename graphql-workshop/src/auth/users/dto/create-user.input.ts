import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Length } from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @Length(1, 20)
    fullName!: string;

    @Field(() => String)
    @IsEmail()
    @Length(1, 50)
    email!: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @Length(8, 100)
    password!: string;

    @Field(() => Int, { nullable: true, defaultValue: 2 })
    @IsInt()
    @IsPositive()
    @IsOptional()
    roleId?: number;

    @Field(() => Boolean, { nullable: true, defaultValue: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
