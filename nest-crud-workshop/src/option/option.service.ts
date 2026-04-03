import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OptionGroup } from '../option-group/entities/option-group.entity';
import { Type } from '../type/entities/type.entity';

import { Option } from './entities/option.entity';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Injectable()
export class OptionService {
    constructor(
        @InjectRepository(Option)
        private readonly optionRepository: Repository<Option>,
        @InjectRepository(OptionGroup)
        private readonly optionGroupRepository: Repository<OptionGroup>,
        @InjectRepository(Type)
        private readonly typeRepository: Repository<Type>,
    ) {}

    async create(createOptionDto: CreateOptionDto) {
        // Verify Type exists
        const type = await this.typeRepository.findOneBy({
            id: createOptionDto.typeId,
        });
        if (!type) {
            throw new BadRequestException(`Type with ID ${createOptionDto.typeId} does not exist`);
        }

        // Verify OptionGroup exists (only if provided)
        let optionGroup: OptionGroup | null = null;
        if (createOptionDto.groupId) {
            optionGroup = await this.optionGroupRepository.findOneBy({
                id: createOptionDto.groupId,
            });
            if (!optionGroup) {
                throw new BadRequestException(`OptionGroup with ID ${createOptionDto.groupId} does not exist`);
            }
        }

        const option = this.optionRepository.create({
            ...createOptionDto,
            type,
            ...(optionGroup && { optionGroup }),
        });
        return this.optionRepository.save(option);
    }

    async findAll() {
        return this.optionRepository.find();
    }

    async findOne(id: number) {
        const option = await this.optionRepository.findOneBy({ id });
        if (!option) {
            throw new NotFoundException(`Option with ID ${id} not found`);
        }
        return option;
    }

    async update(id: number, updateOptionDto: UpdateOptionDto) {
        // Verify option exists
        const option = await this.optionRepository.findOneBy({ id });
        if (!option) {
            throw new NotFoundException(`Option with ID ${id} not found`);
        }

        // If group ID is being updated, verify new group exists
        let optionGroup: OptionGroup | null = null;
        if (updateOptionDto.groupId) {
            optionGroup = await this.optionGroupRepository.findOneBy({
                id: updateOptionDto.groupId,
            });
            if (!optionGroup) {
                throw new BadRequestException(`OptionGroup with ID ${updateOptionDto.groupId} does not exist`);
            }
        }

        // If type ID is being updated, verify new type exists
        let type: Type | null = null;
        if (updateOptionDto.typeId) {
            type = await this.typeRepository.findOneBy({
                id: updateOptionDto.typeId,
            });
            if (!type) {
                throw new BadRequestException(`Type with ID ${updateOptionDto.typeId} does not exist`);
            }
        }

        await this.optionRepository.update(id, {
            name: updateOptionDto.name,
            ...(optionGroup && { optionGroup }),
            ...(type && { type }),
        });
        return this.optionRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const option = await this.optionRepository.findOneBy({ id });
        if (!option) {
            throw new NotFoundException(`Option with ID ${id} not found`);
        }
        return this.optionRepository.delete(id);
    }
}
