import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Type } from 'src/type/entities/type.entity';
import { Survey } from 'src/survey/entities/survey.entity';
import { Question } from 'src/question/entities/question.entity';

@Entity('sections')
export class Section {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column()
    tail!: string;

    @Column({ name: 'order_col' })
    orderCol!: number;

    @Column({ name: 'background_image' })
    backgroundImage!: string;

    @ManyToOne(() => Section, (section) => section.sections)
    @JoinColumn({ name: 'section_id' })
    section!: Section;

    @OneToMany(() => Section, (section) => section.section)
    sections!: Section[];

    @ManyToOne(() => Type, (type) => type.sections)
    @JoinColumn({ name: 'type_id' })
    type!: Type;

    @ManyToOne(() => Survey, (survey) => survey.sections)
    @JoinColumn({ name: 'survey_id' })
    survey!: Survey;

    @OneToMany(() => Question, (question) => question.section)
    questions!: Question[];
}
