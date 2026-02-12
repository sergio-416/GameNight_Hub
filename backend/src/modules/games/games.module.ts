import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GamesController } from './presentation/games.controller';
import { GamesService } from './application/games.service';
import { BggIntegrationService } from './application/bgg-integration.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BoardGame,
  BoardGameSchema,
} from './infrastructure/persistence/mongodb/game.schema';

@Module({
  controllers: [GamesController],
  providers: [GamesService, BggIntegrationService],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: BoardGame.name, schema: BoardGameSchema },
    ]),
  ],
})
export class GamesModule {}
