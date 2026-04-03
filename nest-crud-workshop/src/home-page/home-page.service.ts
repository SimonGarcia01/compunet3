import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Survey } from '../survey/entities/survey.entity';

import { HomePage } from './entities/home-page.entity';
import { CreateHomePageDto } from './dto/create-home-page.dto';
import { UpdateHomePageDto } from './dto/update-home-page.dto';

@Injectable()
export class HomePageService {
    constructor(
        @InjectRepository(HomePage)
        private readonly homePageRepository: Repository<HomePage>,
        @InjectRepository(Survey)
        private readonly surveyRepository: Repository<Survey>,
    ) {}

    async create(createHomePageDto: CreateHomePageDto) {
        // Verify Survey exists
        const survey = await this.surveyRepository.findOneBy({
            id: createHomePageDto.surveyId,
        });
        if (!survey) {
            throw new BadRequestException(`Survey with ID ${createHomePageDto.surveyId} does not exist`);
        }

        const homePage = this.homePageRepository.create({
            ...createHomePageDto,
            survey,
        });
        return this.homePageRepository.save(homePage);
    }

    async findAll() {
        return this.homePageRepository.find();
    }

    async findOne(id: number) {
        const homePage = await this.homePageRepository.findOneBy({ id });
        if (!homePage) {
            throw new NotFoundException(`HomePage with ID ${id} not found`);
        }
        return homePage;
    }

    async update(id: number, updateHomePageDto: UpdateHomePageDto) {
        // Verify homePage exists
        const homePage = await this.homePageRepository.findOneBy({ id });
        if (!homePage) {
            throw new NotFoundException(`HomePage with ID ${id} not found`);
        }

        // If survey ID is being updated, verify new survey exists
        let survey: Survey | null = null;
        if (updateHomePageDto.surveyId) {
            survey = await this.surveyRepository.findOneBy({
                id: updateHomePageDto.surveyId,
            });
            if (!survey) {
                throw new BadRequestException(`Survey with ID ${updateHomePageDto.surveyId} does not exist`);
            }
        }

        await this.homePageRepository.update(id, {
            backgroundImage: updateHomePageDto.backgroundImage,
            welcomeMessage: updateHomePageDto.welcomeMessage,
            ...(survey && { survey }),
        });
        return this.homePageRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const homePage = await this.homePageRepository.findOneBy({ id });
        if (!homePage) {
            throw new NotFoundException(`HomePage with ID ${id} not found`);
        }
        return this.homePageRepository.delete(id);
    }
}
