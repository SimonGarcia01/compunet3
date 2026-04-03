import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Survey } from 'src/survey/entities/survey.entity';

@Entity('assignments')
export class Assignment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    amount!: number;

    @Column({ name: 'user_id' })
    userId!: string;

    @ManyToOne(() => Survey, (survey) => survey.assignments)
    @JoinColumn({ name: 'survey_id' })
    survey!: Survey;
}
