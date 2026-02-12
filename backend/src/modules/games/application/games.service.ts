import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BggIntegrationService } from './bgg-integration.service';
import {
  BoardGame,
  BoardGameDocument,
} from '../infrastructure/persistence/mongodb/game.schema';

@Injectable()
export class GamesService {
  constructor(
    private readonly bggService: BggIntegrationService,
    @InjectModel(BoardGame.name)
    private readonly boardGameModel: Model<BoardGame>,
  ) {}

  async create(
    bggId: number,
    personalFields: {
      owned?: boolean;
      notes?: string;
      complexity?: number;
    },
  ) {
    const bggDetails = await this.bggService.getGameDetails(bggId);

    const game = await this.boardGameModel.create({
      ...bggDetails,
      ...personalFields,
    });

    return game;
  }

  async findAll(): Promise<BoardGameDocument[]> {
    return this.boardGameModel.find().exec();
  }

  async findOne(id: string): Promise<BoardGameDocument | null> {
    return this.boardGameModel.findById(id).exec();
  }
  async update(
    id: string,
    personalFields: {
      owned?: boolean;
      notes?: string;
      complexity?: number;
    },
  ): Promise<BoardGameDocument | null> {
    return this.boardGameModel
      .findByIdAndUpdate(id, personalFields, { new: true })
      .exec();
  }

  async remove(id: string): Promise<BoardGameDocument | null> {
    return this.boardGameModel.findByIdAndDelete(id).exec();
  }

  async getStats() {
    const games = await this.boardGameModel.find().exec();

    const categoryCount = new Map<string, number>();
    games.forEach((game) => {
      game.categories?.forEach((category) => {
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      });
    });

    const complexityCount = new Map<number, number>();
    games.forEach((game) => {
      if (game.complexity) {
        complexityCount.set(
          game.complexity,
          (complexityCount.get(game.complexity) || 0) + 1,
        );
      }
    });

    const growthData = new Map<string, number>();
    games.forEach((game) => {
      const date = game.createdAt ?? new Date();

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      growthData.set(monthKey, (growthData.get(monthKey) || 0) + 1);
    });

    const sortedGrowth = Array.from(growthData.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([x, y]) => ({ x, y }));

    return {
      gamesByCategory: Array.from(categoryCount.entries()).map(
        ([name, value]) => ({
          name,
          value,
        }),
      ),
      complexityDistribution: Array.from(complexityCount.entries()).map(
        ([name, value]) => ({
          name: `${name} - ${this.getComplexityLabel(name)}`,
          value,
        }),
      ),
      collectionGrowth: sortedGrowth,
      totalGames: games.length,
    };
  }

  private getComplexityLabel(level: number): string {
    const labels: Record<number, string> = {
      1: 'Light',
      2: 'Light-Medium',
      3: 'Medium',
      4: 'Medium-Heavy',
      5: 'Heavy',
    };
    return labels[level] || 'Unknown';
  }
}
