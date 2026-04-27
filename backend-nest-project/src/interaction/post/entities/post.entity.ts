import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'src/auth/user/entities/user.entity';
import { Reply } from 'src/interaction/reply/entities/reply.entity';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.posts, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ nullable: false, length: 30 })
    title!: string;

    @Column({ nullable: false, length: 1000 })
    question!: string;

    @Column({ name: 'date_added', type: 'timestamp', nullable: false })
    dateAdded!: Date;

    @OneToMany(() => Reply, (reply) => reply.post, { eager: true })
    replies!: Reply[];
}
