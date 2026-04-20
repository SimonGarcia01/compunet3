import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Player } from '@/players/entities/player.entity';
import { Round } from '@/rounds/entities/round.entity';

export enum MoveType {
    ATTACK = 1,
    DEFENSE = 2,
    SPECIAL = 3,
}

@Unique(['player', 'round'])
@Entity('moves')
export class Move {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @Column({ name: 'move_type', type: 'enum', enum: MoveType, nullable: false })
    moveType!: MoveType;

    @ManyToOne(() => Player, (player) => player.moves, { nullable: false })
    @JoinColumn({ name: 'player_id' })
    player!: Player;

    @ManyToOne(() => Round, (round) => round.moves, { nullable: false })
    @JoinColumn({ name: 'round_id' })
    round!: Round;
}
