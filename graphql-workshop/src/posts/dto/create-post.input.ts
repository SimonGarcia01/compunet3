import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';

@InputType()
export class CreatePostInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    title!: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @Length(1, 1000)
    content!: string;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    authorId!: number;
}
