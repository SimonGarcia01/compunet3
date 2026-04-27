import { Module } from '@nestjs/common';

import { PostModule } from './post/post.module';
import { ReplyModule } from './reply/reply.module';

@Module({
    imports: [PostModule, ReplyModule],
})
export class InteractionModule {}
