import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { OptionGroup } from '../../option-group/entities/option-group.entity';
import { Question } from '../../question/entities/question.entity';
import { Option } from '../../option/entities/option.entity';

@Entity('option_questions')
export class OptionQuestion {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Question, (question) => question.optionQuestions)
    @JoinColumn({ name: 'question_id' })
    question!: Question;

    @ManyToOne(() => Option, (option) => option.optionQuestions)
    @JoinColumn({ name: 'option_id' })
    option!: Option;

    @ManyToOne(() => OptionGroup, (optionGroup) => optionGroup.optionQuestions)
    @JoinColumn({ name: 'group_id' })
    optionGroup!: OptionGroup;
}
