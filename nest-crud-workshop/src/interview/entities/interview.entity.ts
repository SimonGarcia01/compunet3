import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Survey } from 'src/survey/entities/survey.entity';
import { Answer } from 'src/answer/entities/answer.entity';

@Entity('interviews')
export class Interview {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'timestamp', name: 'time_start' })
    timeStart!: Date;

    @Column({ name: 'interviewer_id' })
    interviewerId!: string;

    @Column({ type: 'timestamp', name: 'time_end' })
    timeEnd!: Date;

    @Column()
    username!: string;

    @Column({ name: 'institution_id' })
    institutionId!: string;

    @ManyToOne(() => Survey, (survey) => survey.interviews)
    @JoinColumn({ name: 'survey_id' })
    survey!: Survey;

    @OneToMany(() => Answer, (answer) => answer.interview)
    answers!: Answer[];
}
