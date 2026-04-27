import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserBadge } from 'src/badge/user-badge/entities/user-badge.entity';

@Entity('experience_badges')
export class ExperienceBadge {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false, length: 20 })
    name!: string;

    @Column({ name: 'min_level', nullable: false })
    minLevel!: number;

    @Column({ nullable: false, length: 100 })
    message!: string;

    @Column({ name: 'associate_prices', nullable: true, length: 100 })
    associatePrices?: string;

    @OneToMany(() => UserBadge, (userBadge) => userBadge.experienceBadge)
    usersBadges!: UserBadge[];
}
