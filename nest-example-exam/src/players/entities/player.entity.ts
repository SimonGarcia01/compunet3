import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Session } from '@/sessions/entities/session.entity';
import { Move } from '@/moves/entities/move.entity';

@Entity('players')
export class Player {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ name: 'health_points' })
    healthPoints!: number;

    @OneToMany(() => Session, (session) => session.player1, { eager: true })
    sessions1!: Session[];

    @OneToMany(() => Session, (session) => session.player2, { eager: true })
    sessions2!: Session[];

    @OneToMany(() => Move, (move) => move.player, { eager: true })
    moves!: Move[];
}
