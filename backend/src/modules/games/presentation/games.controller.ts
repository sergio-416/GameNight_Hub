import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { GamesService } from '../application/games.service';
import { BggIntegrationService } from '../application/bgg-integration.service';
import { BggCsvService } from '../application/bgg-csv.service';

@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService,
    private readonly bggService: BggIntegrationService,
    private readonly bggCsvService: BggCsvService,
  ) {}

  @Post('import/:bggId')
  async create(
    @Param('bggId') bggId: string,
    @Body()
    personalFields: {
      owned?: boolean;
      notes?: string;
      complexity?: number;
    },
  ) {
    return this.gamesService.create(parseInt(bggId, 10), personalFields);
  }

  @Get()
  async findAll() {
    return this.gamesService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.gamesService.getStats();
  }

  @Get('search')
  searchLocal(@Query('query') query: string) {
    return this.bggCsvService.search(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    personalFields: {
      owned?: boolean;
      notes?: string;
      complexity?: number;
    },
  ) {
    return this.gamesService.update(id, personalFields);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }

  @Get('bgg/search')
  async searchBgg(@Query('query') query: string) {
    return this.bggService.searchGames(query);
  }

  @Get('bgg/game/:bggId')
  async getBggGameDetails(@Param('bggId') bggId: string) {
    return this.bggService.getGameDetails(parseInt(bggId, 10));
  }
}
