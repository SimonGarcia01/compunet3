import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Question } from 'src/question/entities/question.entity';
import { Interview } from 'src/interview/entities/interview.entity';

@Entity('answers')
export class Answer {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    answer!: string;

    @ManyToOne(() => Question, (question) => question.answers)
    @JoinColumn({ name: 'question_id' })
    question!: Question;

    @ManyToOne(() => Interview, (interview) => interview.answers)
    @JoinColumn({ name: 'interview_id' })
    interview!: Interview;
}
