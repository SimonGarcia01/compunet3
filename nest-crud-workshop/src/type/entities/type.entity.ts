import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Question } from 'src/question/entities/question.entity';
import { Option } from 'src/option/entities/option.entity';
import { Section } from 'src/section/entities/section.entity';

@Entity('types')
export class Type {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({ name: 'table_name' })
    tableName!: string;

    @OneToMany(() => Question, (question) => question.type)
    questions!: Question[];

    @OneToMany(() => Option, (option) => option.type)
    options!: Option[];

    @OneToMany(() => Section, (section) => section.type)
    sections!: Section[];
}
