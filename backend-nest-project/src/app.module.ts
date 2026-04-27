import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BadgeModule } from './badge/badge.module';
import { InteractionModule } from './interaction/interaction.module';
import { CourseModule } from './course/course.module';
import { SupplementarySessionModule } from './supplementary-session/supplementary-session.module';

type SupportedDbTypes = 'mysql' | 'postgres';

@Module({
    imports: [
        AuthModule,
        BadgeModule,
        CourseModule,
        InteractionModule,
        SupplementarySessionModule,
        ConfigModule.forRoot({ isGlobal: true }),
        // Making the TypeOrmModule to configure the database and tell which entities we want to use
        // This will make the tables in the database and create the repositories to interact with the DB
        TypeOrmModule.forRootAsync({
            // Make the .env variables available
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const databaseUrl = configService.get<string>('DATABASE_URL');
                // If a DATABASE_URL is provided (Railway/Heroku style), prefer it and enable SSL
                if (databaseUrl) {
                    return {
                        type: 'postgres' as SupportedDbTypes,
                        url: databaseUrl,
                        // Enable SSL for cloud Postgres providers (skip cert validation)
                        ssl: { rejectUnauthorized: false },
                        extra: { ssl: { rejectUnauthorized: false } },
                        entities: [__dirname + '/../**/*.entity.js'],
                        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
                    };
                }

                // Fallback to individual DB_* env vars (useful for local/dev)
                const portValue = configService.get<string | number>('DB_PORT');
                const port = portValue ? Number(portValue) : undefined;
                return {
                    type: configService.get<SupportedDbTypes>('DB_TYPE') ?? 'mysql',
                    host: configService.get<string>('DB_HOST') ?? 'localhost',
                    port,
                    username: configService.get<string>('DB_USERNAME'),
                    password: configService.get<string>('DB_PASSWORD'),
                    database: configService.get<string>('DB_DATABASE'),
                    entities: [__dirname + '/../**/*.entity.js'],
                    synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
                };
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
