import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { RoundsService } from './rounds.service';
import { CreateRoundDto } from './dto/create-round.dto';

@Controller('rounds')
export class RoundsController {
    constructor(private readonly roundsService: RoundsService) {}

    @Post()
    create(@Body() createRoundDto: CreateRoundDto) {
        return this.roundsService.create(createRoundDto);
    }

    @Get()
    findAll() {
        return this.roundsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.roundsService.findOne(+id);
    }
}
