import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Type } from './entities/type.entity';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypeService {
    constructor(
        @InjectRepository(Type)
        private readonly typeRepository: Repository<Type>,
    ) {}

    async create(createTypeDto: CreateTypeDto) {
        const type = this.typeRepository.create(createTypeDto);
        return this.typeRepository.save(type);
    }

    async findAll() {
        return this.typeRepository.find();
    }

    async findOne(id: number) {
        const type = await this.typeRepository.findOneBy({ id });
        if (!type) {
            throw new NotFoundException(`Type with ID ${id} not found`);
        }
        return type;
    }

    async update(id: number, updateTypeDto: UpdateTypeDto) {
        // Verify type exists
        const type = await this.typeRepository.findOneBy({ id });
        if (!type) {
            throw new NotFoundException(`Type with ID ${id} not found`);
        }

        await this.typeRepository.update(id, updateTypeDto);
        return this.typeRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const type = await this.typeRepository.findOneBy({ id });
        if (!type) {
            throw new NotFoundException(`Type with ID ${id} not found`);
        }
        return this.typeRepository.delete(id);
    }
}
