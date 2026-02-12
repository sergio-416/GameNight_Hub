/* eslint-disable @typescript-eslint/await-thenable */
import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from '../application/games.service';
import { vi } from 'vitest';
import { BggIntegrationService } from '../application/bgg-integration.service';
import { BggCsvService } from '../application/bgg-csv.service';

describe('GamesController', () => {
  let controller: GamesController;

  const mockGamesService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    getStats: vi.fn(),
  };

  const mockBggService = {
    searchGames: vi.fn(),
    getGameDetails: vi.fn(),
  };

  const mockBggCsvService = {
    search: vi.fn(),
    getById: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: mockGamesService,
        },
        {
          provide: BggIntegrationService,
          useValue: mockBggService,
        },
        {
          provide: BggCsvService,
          useValue: mockBggCsvService,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
  });

  describe('create (POST /api/games/import/:bggId)', () => {
    it('should import game from BGG and return 201 with created game', async () => {
      const bggId = 13;
      const personalFields = {
        owned: true,
        notes: 'My favorite game!',
        complexity: 3,
      };

      const createdGame = {
        _id: 'mongo-id-123',
        bggId: 13,
        name: 'Catan',
        owned: true,
        notes: 'My favorite game!',
        complexity: 3,
        createdAt: new Date(),
      };

      mockGamesService.create.mockResolvedValue(createdGame);

      const result = await controller.create(bggId.toString(), personalFields);

      expect(result).toBeDefined();
      expect(result.bggId).toBe(13);
      expect(result.name).toBe('Catan');
      expect(result.owned).toBe(true);
    });
  });

  describe('findAll (GET /api/games)', () => {
    it('should return array of all games in collection', async () => {
      const games = [
        { _id: '1', name: 'Catan', bggId: 13 },
        { _id: '2', name: 'Ticket to Ride', bggId: 42 },
      ];

      mockGamesService.findAll.mockResolvedValue(games);

      const result = await controller.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Catan');
    });
  });

  describe('findOne (GET /api/games/:id)', () => {
    it('should return single game by id', async () => {
      const game = {
        _id: 'mongo-id-123',
        bggId: 13,
        name: 'Catan',
        owned: true,
      };

      mockGamesService.findOne.mockResolvedValue(game);

      const result = await controller.findOne('mongo-id-123');

      expect(result).not.toBeNull();

      expect(result).toMatchObject({
        _id: 'mongo-id-123',
        name: 'Catan',
      });
    });

    it('should return null when game not found', async () => {
      mockGamesService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('update (PATCH /api/games/:id)', () => {
    it('should update personal fields and return updated game', async () => {
      const updatedGame = {
        _id: 'mongo-id-123',
        bggId: 13,
        name: 'Catan',
        owned: true,
        notes: 'Updated notes!',
        complexity: 4,
      };

      mockGamesService.update.mockResolvedValue(updatedGame);

      const result = await controller.update('mongo-id-123', {
        owned: true,
        notes: 'Updated notes!',
        complexity: 4,
      });

      expect(result).not.toBeNull();
      expect(result).toMatchObject({
        owned: true,
        notes: 'Updated notes!',
        complexity: 4,
      });
    });

    it('should return null when updating non-existent game', async () => {
      mockGamesService.update.mockResolvedValue(null);

      const result = await controller.update('nonexistent-id', {
        owned: true,
      });

      expect(result).toBeNull();
    });
  });

  describe('remove (DELETE /api/games/:id)', () => {
    it('should delete game and return deleted game', async () => {
      const deletedGame = {
        _id: 'mongo-id-123',
        name: 'Catan',
        bggId: 13,
      };

      mockGamesService.remove.mockResolvedValue(deletedGame);

      const result = await controller.remove('mongo-id-123');

      expect(result).not.toBeNull();
      expect(result).toMatchObject({
        _id: 'mongo-id-123',
        name: 'Catan',
      });
    });

    it('should return null when deleting non-existent game', async () => {
      mockGamesService.remove.mockResolvedValue(null);

      const result = await controller.remove('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('BGG Integration', () => {
    describe('search (GET /api/bgg/search)', () => {
      it('should return search results from BoardGameGeek', async () => {
        const searchResults = [
          { bggId: 13, name: 'Catan', yearPublished: 1995 },
          { bggId: 115746, name: 'Catan: Seafarers', yearPublished: 1997 },
        ];

        mockBggService.searchGames.mockResolvedValue(searchResults);

        const result = await controller.searchBgg('catan');

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty('name');
      });
    });

    describe('getBggGameDetails (GET /api/bgg/game/:bggId)', () => {
      it('should return full game details from BoardGameGeek', async () => {
        const gameDetails = {
          bggId: 13,
          name: 'Catan',
          yearPublished: 1995,
          minPlayers: 3,
          maxPlayers: 4,
          description: 'A strategy game',
        };

        mockBggService.getGameDetails.mockResolvedValue(gameDetails);

        const result = await controller.getBggGameDetails('13');

        expect(result).toBeDefined();
        expect(result.bggId).toBe(13);
        expect(result.name).toBe('Catan');
      });
    });
  });

  describe('getStats (GET /api/games/stats)', () => {
    it('should return statistics for games collection', async () => {
      const mockStats = {
        gamesByCategory: [
          { name: 'Strategy', value: 5 },
          { name: 'Family', value: 3 },
        ],
        complexityDistribution: [
          { name: '1 - Light', value: 2 },
          { name: '3 - Medium', value: 4 },
        ],
        collectionGrowth: [
          { x: '2024-01', y: 1 },
          { x: '2024-02', y: 3 },
        ],
        totalGames: 10,
      };

      mockGamesService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats();

      expect(result).toBeDefined();
      expect(result.totalGames).toBe(10);
      expect(result.gamesByCategory).toHaveLength(2);
      expect(result.complexityDistribution).toHaveLength(2);
      expect(result.collectionGrowth).toHaveLength(2);
      expect(result.gamesByCategory[0]).toHaveProperty('name');
      expect(result.gamesByCategory[0]).toHaveProperty('value');
    });

    it('should return empty stats when no games in collection', async () => {
      const emptyStats = {
        gamesByCategory: [],
        complexityDistribution: [],
        collectionGrowth: [],
        totalGames: 0,
      };

      mockGamesService.getStats.mockResolvedValue(emptyStats);

      const result = await controller.getStats();

      expect(result.totalGames).toBe(0);
      expect(result.gamesByCategory).toHaveLength(0);
      expect(result.complexityDistribution).toHaveLength(0);
      expect(result.collectionGrowth).toHaveLength(0);
    });
  });

  describe('Local CSV Search (GET /api/games/search)', () => {
    it('should return matching games from local CSV', async () => {
      const csvResults = [
        {
          id: '13',
          name: 'CATAN',
          yearpublished: '1995',
          rank: '5',
          average: '7.4',
        },
        {
          id: '115746',
          name: 'CATAN: SEAFARERS',
          yearpublished: '1997',
          rank: '150',
        },
      ];

      mockBggCsvService.search.mockResolvedValue(csvResults);

      const result = await controller.searchLocal('catan');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('rank');
      expect(mockBggCsvService.search).toHaveBeenCalledWith('catan');
    });

    it('should return empty array when no matches found', async () => {
      mockBggCsvService.search.mockResolvedValue([]);

      const result = await controller.searchLocal('nonexistentgame12345');

      expect(result).toEqual([]);
      expect(mockBggCsvService.search).toHaveBeenCalledWith(
        'nonexistentgame12345',
      );
    });

    it('should pass query to BggCsvService and return results', async () => {
      const csvResults = [
        { id: '13', name: 'CATAN', rank: '5' },
        { id: '42', name: 'TICKET TO RIDE', rank: '100' },
      ];

      mockBggCsvService.search.mockResolvedValue(csvResults);

      const result = await controller.searchLocal('ticket');

      expect(result).toEqual(csvResults);
      expect(mockBggCsvService.search).toHaveBeenCalledWith('ticket');
    });
  });
});
