import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Survey } from '../survey/entities/survey.entity';

import { HomePageService } from './home-page.service';
import { HomePageController } from './home-page.controller';
import { HomePage } from './entities/home-page.entity';

@Module({
    imports: [TypeOrmModule.forFeature([HomePage, Survey])],
    controllers: [HomePageController],
    providers: [HomePageService],
    exports: [TypeOrmModule],
})
export class HomePageModule {}
