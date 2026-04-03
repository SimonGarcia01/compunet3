import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Type } from 'src/type/entities/type.entity';
import { Section } from 'src/section/entities/section.entity';
import { Metadatum } from 'src/metadata/entities/metadatum.entity';
import { OptionQuestion } from 'src/option-question/entities/option-question.entity';
import { Answer } from 'src/answer/entities/answer.entity';

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 1000 })
    name!: string;

    @Column({ name: 'cod_quest', length: 200 })
    codQuest!: string;

    @Column({ name: 'order_col' })
    orderCol!: number;

    // -----------------------------------------------------------------------------
    // Auto-relation to create a tree structure of questions
    @OneToMany(() => Question, (question) => question.question)
    questions!: Question[];

    @ManyToOne(() => Question, (question) => question.questions)
    @JoinColumn({ name: 'question_id' })
    question!: Question;
    // -----------------------------------------------------------------------------

    @ManyToOne(() => Type, (type) => type.questions)
    @JoinColumn({ name: 'type_id' })
    type!: Type;

    @ManyToOne(() => Section, (section) => section.questions)
    @JoinColumn({ name: 'section_id' })
    section!: Section;

    @OneToMany(() => Metadatum, (metadatum) => metadatum.question)
    metadata!: Metadatum[];

    @OneToMany(() => OptionQuestion, (optionQuestion) => optionQuestion.question)
    optionQuestions!: OptionQuestion[];

    @OneToMany(() => Answer, (answer) => answer.question)
    answers!: Answer[];
}
