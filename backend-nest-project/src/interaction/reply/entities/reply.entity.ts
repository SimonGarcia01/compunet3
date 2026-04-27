import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from 'src/interaction/post/entities/post.entity';
import { User } from 'src/auth/user/entities/user.entity';

@Entity('replies')
export class Reply {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Post, (post) => post.replies, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post!: Post;

    @ManyToOne(() => User, (user) => user.replies, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @OneToMany(() => Reply, (reply) => reply.reply, { nullable: true })
    replies?: Reply[];

    @ManyToOne(() => Reply, (reply) => reply.replies, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'reply_id' })
    reply?: Reply | null;

    @Column({ name: 'reply_message', nullable: false, length: 1000 })
    replyMessage!: string;

    @Column({ name: 'date_added', type: 'timestamp', nullable: false })
    dateAdded!: Date;

    @Column({ nullable: false })
    likes!: number;

    @Column({ nullable: false })
    approvals!: number;

    @Column({ name: 'is_validated', type: 'boolean', default: false })
    isValidated!: boolean;
}
