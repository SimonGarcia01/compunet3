import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import {IsEmail, IsString, Length} from 'class-validator';

export class UserLoginDto {
    @ApiProperty({ example: 'dave@example.com' })
    @IsEmail({}, {message: 'Email must be a valid email address'})
    email!: string;

    @ApiProperty({ example: 'password123' })
    @IsString({message: 'Password must be a string'})
    @Length(6, 20, {message: 'Password must be between 6 and 20 characters'})
    password!: string;
}