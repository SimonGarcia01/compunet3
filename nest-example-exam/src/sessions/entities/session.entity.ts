import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Player } from '@/players/entities/player.entity';
import { Round } from '@/rounds/entities/round.entity';

@Entity('sessions')
export class Session {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    status!: string;

    @Column({ name: 'max_rounds', nullable: false })
    maxRounds!: number;

    @ManyToOne(() => Player, (player) => player.sessions1, { nullable: false })
    @JoinColumn({ name: 'player1_id' })
    player1!: Player;

    @ManyToOne(() => Player, (player) => player.sessions2, { nullable: false })
    @JoinColumn({ name: 'player2_id' })
    player2!: Player;

    @OneToMany(() => Round, (round) => round.session, { eager: true })
    rounds!: Round[];
}
