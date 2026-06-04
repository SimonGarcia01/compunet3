import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsInt, IsNotEmpty, IsPositive, IsString, Length } from 'class-validator';

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

    @Field(() => Int)
    @IsInt()
    @IsPositive()
    roleId!: number;
}
