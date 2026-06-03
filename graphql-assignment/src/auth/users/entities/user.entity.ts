import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class User {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;
}
