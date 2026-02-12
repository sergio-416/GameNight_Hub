import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';
import { BggGameRank } from '../domain/entities/bgg-game-rank.entity';

@Injectable()
export class BggCsvService implements OnModuleInit {
  readonly #logger = new Logger(BggCsvService.name);
  readonly #games: BggGameRank[] = [];
  readonly #maxSearchResults = 50;
  #loaded = false;

  onModuleInit(): void {
    if (!this.#loaded) {
      this.#loadCsvData();
      this.#loaded = true;
    }
  }

  #getCsvPath(): string | undefined {
    const possiblePaths = [
      path.resolve('data', 'bgg_ranks_02_26.csv'),
      path.resolve('backend', 'data', 'bgg_ranks_02_26.csv'),
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'data',
        'bgg_ranks_02_26.csv',
      ),
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'data',
        'bgg_ranks_02_26.csv',
      ),
    ];

    for (const csvPath of possiblePaths) {
      if (fs.existsSync(csvPath)) {
        return csvPath;
      }
    }

    return undefined;
  }

  #loadCsvData(): void {
    const csvPath = this.#getCsvPath();

    if (!csvPath) {
      this.#logger.warn('CSV file not found');
      return;
    }

    try {
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      for (const record of records as Record<string, string>[]) {
        this.#games.push(record as unknown as BggGameRank);
      }

      this.#logger.log(`Loaded ${this.#games.length} games from CSV`);
    } catch (error) {
      this.#logger.error('Failed to load CSV data', error);
    }
  }

  search(query: string): BggGameRank[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();

    const results = this.#games.filter((game) =>
      game.name.toLowerCase().includes(normalizedQuery),
    );

    return results.slice(0, this.#maxSearchResults);
  }

  getById(id: string): BggGameRank | undefined {
    return this.#games.find((game) => game.id === id);
  }
}
