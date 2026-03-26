import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UserInput {
    name: string;
    email: string;
    password: string;
    roleId: number;
}

export class UserInputNameRole {
    @IsString()
    @MaxLength(15)
    name: string;
    @IsString()
    @IsEmail()
    email: string;
    @MinLength(5)
    @MaxLength(20)
    password: string;
    @IsString()
    roleName: string;
}
