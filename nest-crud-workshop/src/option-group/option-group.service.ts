import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OptionGroup } from './entities/option-group.entity';
import { CreateOptionGroupDto } from './dto/create-option-group.dto';
import { UpdateOptionGroupDto } from './dto/update-option-group.dto';

@Injectable()
export class OptionGroupService {
    constructor(
        @InjectRepository(OptionGroup)
        private readonly optionGroupRepository: Repository<OptionGroup>,
    ) {}

    async create(createOptionGroupDto: CreateOptionGroupDto) {
        const optionGroup = this.optionGroupRepository.create(createOptionGroupDto);
        return this.optionGroupRepository.save(optionGroup);
    }

    async findAll() {
        return this.optionGroupRepository.find();
    }

    async findOne(id: number) {
        const optionGroup = await this.optionGroupRepository.findOneBy({ id });
        if (!optionGroup) {
            throw new NotFoundException(`OptionGroup with ID ${id} not found`);
        }
        return optionGroup;
    }

    async update(id: number, updateOptionGroupDto: UpdateOptionGroupDto) {
        // Verify optionGroup exists
        const optionGroup = await this.optionGroupRepository.findOneBy({ id });
        if (!optionGroup) {
            throw new NotFoundException(`OptionGroup with ID ${id} not found`);
        }

        await this.optionGroupRepository.update(id, updateOptionGroupDto);
        return this.optionGroupRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const optionGroup = await this.optionGroupRepository.findOneBy({ id });
        if (!optionGroup) {
            throw new NotFoundException(`OptionGroup with ID ${id} not found`);
        }
        return this.optionGroupRepository.delete(id);
    }
}
