import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
    constructor(@InjectRepository(Project) private readonly projectRepository: Repository<Project>) {}

    async create(createProjectDto: CreateProjectDto): Promise<Project | null> {
        const newProject = this.projectRepository.create({
            ...createProjectDto,
            createdAt: new Date(),
        });

        return await this.projectRepository.save(newProject);
    }

    async findAll(): Promise<Project[]> {
        return await this.projectRepository.find();
    }

    async findOne(id: number): Promise<Project | null> {
        return await this.projectRepository.findOneBy({ id: id });
    }
}
