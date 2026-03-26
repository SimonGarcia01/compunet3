import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    //Add the validation pipe globally so it can be used anywhere without needing to add it to the controllers
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
    console.error('Error starting the application:', err);
    process.exit(1);
});
