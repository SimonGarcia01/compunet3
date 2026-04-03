import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OptionGroupModule } from './option-group/option-group.module';
import { OptionModule } from './option/option.module';
import { OptionQuestionModule } from './option-question/option-question.module';
import { MetadataModule } from './metadata/metadata.module';
import { QuestionModule } from './question/question.module';
import { TypeModule } from './type/type.module';
import { AnswerModule } from './answer/answer.module';
import { SectionModule } from './section/section.module';
import { SurveyModule } from './survey/survey.module';
import { ProjectModule } from './project/project.module';
import { HomePageModule } from './home-page/home-page.module';
import { InterviewModule } from './interview/interview.module';
import { AssignmentModule } from './assignment/assignment.module';

type SupportedDbTypes = 'mysql' | 'postgres';

@Module({
    imports: [
        OptionGroupModule,
        OptionModule,
        OptionQuestionModule,
        MetadataModule,
        QuestionModule,
        TypeModule,
        AnswerModule,
        SectionModule,
        SurveyModule,
        ProjectModule,
        HomePageModule,
        InterviewModule,
        AssignmentModule,
        //Makes the .env variables available globally in the app
        ConfigModule.forRoot({ isGlobal: true }),
        // Making the TypeOrmModule to configure the database and tell which entities we want to use
        // This will make the tables in the database and create the repositories to interact with the DB
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
                entities: [__dirname + '/../**/*.entity.js'],
                synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
            }),
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
