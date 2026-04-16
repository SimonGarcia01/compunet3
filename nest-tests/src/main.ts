import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
// Or import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { AppLogger } from './common/logger/logger.service';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
    });
    app.useLogger(app.get(AppLogger));
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
