import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Session } from '@/sessions/entities/session.entity';
import { Move } from '@/moves/entities/move.entity';

@Entity('rounds')
export class Round {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'round_number' })
    roundNumber!: number;

    @Column({ nullable: true })
    result?: string;

    @ManyToOne(() => Session, (session) => session.rounds)
    @JoinColumn({ name: 'session_id' })
    session!: Session;

    @OneToMany(() => Move, (move) => move.round, { eager: true })
    moves!: Move[];
}
