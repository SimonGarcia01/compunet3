import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Option } from '../../option/entities/option.entity';
import { OptionQuestion } from '../../option-question/entities/option-question.entity';

@Entity('option_groups')
export class OptionGroup {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @OneToMany(() => Option, (option) => option.optionGroup)
    options!: Option[];

    @OneToMany(() => OptionQuestion, (optionQuestion) => optionQuestion.optionGroup)
    optionQuestions!: OptionQuestion[];
}
