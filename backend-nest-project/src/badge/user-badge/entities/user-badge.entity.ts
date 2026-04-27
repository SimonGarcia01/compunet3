import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'src/auth/user/entities/user.entity';
import { ExperienceBadge } from 'src/badge/experience-badge/entities/experience-badge.entity';

@Entity('users_badges')
export class UserBadge {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.usersBadges, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => ExperienceBadge, (experienceBadge) => experienceBadge.usersBadges, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'experience_badge_id' })
    experienceBadge!: ExperienceBadge;

    @Column({ name: 'date_acquired', type: 'timestamp', nullable: false })
    dateAcquired!: Date;
}
