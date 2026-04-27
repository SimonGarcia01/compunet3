import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsEmail, IsEnum, IsInt, IsOptional, IsPositive, IsString, Length, Max } from 'class-validator';

export enum Majors {
    SE = 'Software Engineering',
    BIO = 'Biology',
    CHEM = 'Chemistry',
    PHYS = 'Physics',
    MATH = 'Mathematics',
}

export class CreateUserDto {
    @ApiProperty({ example: 'alice@example.com', description: 'Email único del usuario' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @Length(5, 50, { message: 'Email must be between 5 and 50 characters' })
    email!: string;

    @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
    @IsString({ message: 'Password must be a string' })
    @Length(8, 30, { message: 'Password must be between 8 and 30 characters' })
    password!: string;

    @ApiProperty({ example: 'Alice', description: 'Nombre del usuario' })
    @IsString({ message: 'First name must be a string' })
    @Length(1, 20, { message: 'First name must be between 1 and 20 characters' })
    firstName!: string;

    @ApiProperty({ example: 'Smith', description: 'Apellido del usuario' })
    @IsString({ message: 'Last name must be a string' })
    @Length(1, 20, { message: 'Last name must be between 1 and 20 characters' })
    lastName!: string;

    @ApiProperty({ example: 'https://example.com/profile.jpg', description: 'Imagen de perfil del usuario' })
    @IsString({ message: 'Profile picture must be a string' })
    @Length(0, 100, { message: 'Profile picture must be at most 100 characters' })
    @IsOptional()
    profilePic?: string;

    @ApiProperty({ example: 'Computer Science', description: 'Primera carrera del usuario' })
    @IsString({ message: 'Major 1 must be a string' })
    @IsEnum(Majors, { message: `Major 1 must be one of the following: ${Object.values(Majors).join(', ')}` })
    major1!: Majors;

    @ApiProperty({ example: 'Mathematics', description: 'Segunda carrera del usuario' })
    @IsString({ message: 'Major 2 must be a string' })
    @IsEnum(Majors, { message: `Major 2 must be one of the following: ${Object.values(Majors).join(', ')}` })
    @IsOptional()
    major2?: Majors;

    @ApiProperty({ example: 50, description: 'Puntos de experiencia del usuario' })
    @IsInt({ message: 'XP must be an integer' })
    @IsPositive({ message: 'XP must be a positive integer' })
    @Max(100, { message: 'XP must be less than or equal to 100' })
    xp!: number;

    @ApiProperty({ example: 5, description: 'Nivel del usuario' })
    @IsInt({ message: 'Level must be an integer' })
    @IsPositive({ message: 'Level must be a positive integer' })
    @Max(30, { message: 'Level must be less than or equal to 30' })
    level!: number;
}
