import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

//Define the types the user can use fot the DB, this will help with type safety and autocompletion in the code
type SupportedDbTypes = 'mysql' | 'postgres';

//This defines the connection with the database and loads the configuration from the .env file, it also defines the entities that will be used in the application
@Module({
    imports: [
        //Import the AuthModule to use the authentication features in the application
        AuthModule,
        //Makes the .env variables available globally in the app
        ConfigModule.forRoot({ isGlobal: true }),
        //This is the module for the database connection without using a separate Module
        TypeOrmModule.forRootAsync({
            //Make the .env variables available
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                //For each option we need to define the type for typescript, this will help with type safety
                type: configService.get<SupportedDbTypes>('DB_TYPE') ?? 'mysql',
                host: configService.get<string>('DB_HOST') ?? 'localhost',
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: [__dirname + '/**/*.entity.{ts, js}'],
                synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
            }),
        }),
    ],

    controllers: [AppController],

    providers: [AppService],
})
export class AppModule {}
