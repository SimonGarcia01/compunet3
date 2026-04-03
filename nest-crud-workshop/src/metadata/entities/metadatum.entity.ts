import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Question } from 'src/question/entities/question.entity';

@Entity('metadata')
export class Metadatum {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    key!: string;

    @Column()
    value!: string;

    @ManyToOne(() => Question, (question) => question.metadata)
    @JoinColumn({ name: 'question_id' })
    question!: Question;
}
