import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) {}

    async create(createProjectDto: CreateProjectDto) {
        const project = this.projectRepository.create(createProjectDto);
        return this.projectRepository.save(project);
    }

    async findAll() {
        return this.projectRepository.find();
    }

    async findOne(id: number) {
        const project = await this.projectRepository.findOneBy({ id });
        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }

    async update(id: number, updateProjectDto: UpdateProjectDto) {
        // Verify project exists
        const project = await this.projectRepository.findOneBy({ id });
        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }

        await this.projectRepository.update(id, updateProjectDto);
        return this.projectRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const project = await this.projectRepository.findOneBy({ id });
        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }
        return this.projectRepository.delete(id);
    }
}
