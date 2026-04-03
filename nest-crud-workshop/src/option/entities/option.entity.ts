import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { OptionQuestion } from 'src/option-question/entities/option-question.entity';

import { OptionGroup } from '../../option-group/entities/option-group.entity';
import { Type } from '../../type/entities/type.entity';

@Entity('options')
export class Option {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 500 })
    name!: string;

    @ManyToOne(() => OptionGroup, (optionGroup) => optionGroup.options)
    @JoinColumn({ name: 'group_id' })
    optionGroup!: OptionGroup;

    @ManyToOne(() => Type, (type) => type.options)
    @JoinColumn({ name: 'type_id' })
    type!: Type;

    @OneToMany(() => OptionQuestion, (optionQuestion) => optionQuestion.option)
    optionQuestions!: OptionQuestion[];
}
