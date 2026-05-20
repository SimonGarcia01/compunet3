import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
@ObjectType()
export class User {
	@PrimaryGeneratedColumn()
	@Field(() => ID)
	id!: string;

	@Column({ unique: true })
	@Field(() => String)
	fullName!: string;

	@Column()
	@Field(() => String)
	password!: string;

	@Column({
		type: 'text',
		array: true,
		default: ['teacher'],
	})
	@Field(() => [String])
	roles!: string[];

	@Column({
		type: 'boolean',
		default: true,
	})
	@Field(() => Boolean)
	isActive!: boolean;
}
