import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { BggIntegrationService } from './bgg-integration.service';
import { getModelToken } from '@nestjs/mongoose';
import { BoardGame } from '../infrastructure/persistence/mongodb/game.schema';
import { vi } from 'vitest';

describe('GamesService', () => {
  let service: GamesService;

  const mockBggService = {
    getGameDetails: vi.fn(),
  };

  const mockBoardGameModel = {
    create: vi.fn(),
    find: vi.fn().mockReturnValue({ exec: vi.fn() }),
    findById: vi.fn().mockReturnValue({ exec: vi.fn() }),
    findByIdAndUpdate: vi.fn().mockReturnValue({ exec: vi.fn() }),
    findByIdAndDelete: vi.fn().mockReturnValue({ exec: vi.fn() }),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: BggIntegrationService,
          useValue: mockBggService,
        },
        {
          provide: getModelToken(BoardGame.name),
          useValue: mockBoardGameModel,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  describe('create', () => {
    it('should return imported game with BGG data and personal fields merged', async () => {
      mockBggService.getGameDetails.mockResolvedValue({
        bggId: 13,
        name: 'Catan',
        yearPublished: 1995,
        minPlayers: 3,
        maxPlayers: 4,
        playingTime: 120,
        minAge: 10,
        description: 'A strategy game',
        categories: ['Strategy'],
        mechanics: ['Trading'],
        publisher: 'KOSMOS',
      });

      mockBoardGameModel.create.mockResolvedValue({
        _id: 'mongo-id-123',
        bggId: 13,
        name: 'Catan',
        yearPublished: 1995,
        minPlayers: 3,
        maxPlayers: 4,
        playingTime: 120,
        minAge: 10,
        description: 'A strategy game',
        categories: ['Strategy'],
        mechanics: ['Trading'],
        publisher: 'KOSMOS',
        owned: true,
        notes: 'My favorite game!',
        complexity: 3,
        createdAt: new Date(),
      });

      const result = await service.create(13, {
        owned: true,
        notes: 'My favorite game!',
        complexity: 3,
      });

      expect(result._id).toBeDefined();

      expect(result).toMatchObject({
        bggId: 13,
        name: 'Catan',
        yearPublished: 1995,
        minPlayers: 3,
        maxPlayers: 4,
        playingTime: 120,
        minAge: 10,
        description: 'A strategy game',
        categories: ['Strategy'],
        mechanics: ['Trading'],
        publisher: 'KOSMOS',
        owned: true,
        notes: 'My favorite game!',
        complexity: 3,
      });
    });

    it('should return game with default values when personal fields not provided', async () => {
      mockBggService.getGameDetails.mockResolvedValue({
        bggId: 42,
        name: 'Ticket to Ride',
        yearPublished: 2004,
        minPlayers: 2,
        maxPlayers: 5,
        playingTime: 60,
        categories: ['Family'],
        mechanics: ['Card Drafting'],
        publisher: 'Days of Wonder',
      });

      mockBoardGameModel.create.mockResolvedValue({
        _id: 'mongo-id-456',
        bggId: 42,
        name: 'Ticket to Ride',
        yearPublished: 2004,
        minPlayers: 2,
        maxPlayers: 5,
        playingTime: 60,
        categories: ['Family'],
        mechanics: ['Card Drafting'],
        publisher: 'Days of Wonder',
        owned: false,
        notes: undefined,
        complexity: undefined,
        createdAt: new Date(),
      });

      const result = await service.create(42, {});

      expect(result).toMatchObject({
        bggId: 42,
        name: 'Ticket to Ride',
        owned: false,
        notes: undefined,
        complexity: undefined,
      });
    });
  });

  describe('findAll', () => {
    it('should return array of games from collection', async () => {
      const execMock = vi.fn().mockResolvedValue([
        { _id: '1', name: 'Game 1' },
        { _id: '2', name: 'Game 2' },
      ]);
      mockBoardGameModel.find.mockReturnValue({ exec: execMock });

      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('name');
    });
  });

  describe('findOne', () => {
    it('should return game when given valid id', async () => {
      const execMock = vi.fn().mockResolvedValue({
        _id: 'valid-id',
        name: 'Catan',
      });
      mockBoardGameModel.findById.mockReturnValue({ exec: execMock });

      const result = await service.findOne('valid-id');

      expect(result).not.toBeNull();
      expect(result!.name).toBe('Catan');
    });

    it('should return null when game does not exist', async () => {
      const execMock = vi.fn().mockResolvedValue(null);
      mockBoardGameModel.findById.mockReturnValue({ exec: execMock });

      const result = await service.findOne('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update personal fields of existing game', async () => {
      const updatedGame = {
        _id: 'mongo-id-123',
        bggId: 13,
        name: 'Catan',
        owned: true,
        notes: 'Updated notes!',
        complexity: 4,
      };

      const execMock = vi.fn().mockResolvedValue(updatedGame);
      mockBoardGameModel.findByIdAndUpdate.mockReturnValue({ exec: execMock });

      const result = await service.update('mongo-id-123', {
        owned: true,
        notes: 'Updated notes!',
        complexity: 4,
      });

      expect(result).not.toBeNull();
      expect(result!.owned).toBe(true);
      expect(result!.notes).toBe('Updated notes!');
      expect(result!.complexity).toBe(4);
    });

    it('should return null when updating non-existent game', async () => {
      const execMock = vi.fn().mockResolvedValue(null);
      mockBoardGameModel.findByIdAndUpdate.mockReturnValue({ exec: execMock });

      const result = await service.update('nonexistent-id', {
        owned: true,
      });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete game from collection', async () => {
      const execMock = vi.fn().mockResolvedValue({
        _id: 'mongo-id-123',
        name: 'Catan',
      });
      mockBoardGameModel.findByIdAndDelete.mockReturnValue({ exec: execMock });

      const result = await service.remove('mongo-id-123');

      expect(result).not.toBeNull();
      expect(result!._id).toBe('mongo-id-123');
    });

    it('should return null when deleting non-existent game', async () => {
      const execMock = vi.fn().mockResolvedValue(null);
      mockBoardGameModel.findByIdAndDelete.mockReturnValue({ exec: execMock });

      const result = await service.remove('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('getStats', () => {
    it('should return aggregated statistics from games collection', async () => {
      const mockGames = [
        {
          _id: '1',
          name: 'Catan',
          categories: ['Strategy', 'Economic'],
          complexity: 3,
          createdAt: new Date('2024-01-15'),
        },
        {
          _id: '2',
          name: 'Ticket to Ride',
          categories: ['Family', 'Strategy'],
          complexity: 2,
          createdAt: new Date('2024-01-20'),
        },
        {
          _id: '3',
          name: 'Pandemic',
          categories: ['Cooperative', 'Strategy'],
          complexity: 3,
          createdAt: new Date('2024-02-10'),
        },
      ];

      const execMock = vi.fn().mockResolvedValue(mockGames);
      mockBoardGameModel.find.mockReturnValue({ exec: execMock });

      const result = await service.getStats();

      expect(result.totalGames).toBe(3);

      expect(result.gamesByCategory).toHaveLength(4);
      const strategyCategory = result.gamesByCategory.find(
        (c) => c.name === 'Strategy',
      );
      expect(strategyCategory?.value).toBe(3);

      expect(result.complexityDistribution).toHaveLength(2);
      const complexity3 = result.complexityDistribution.find((c) =>
        c.name.includes('3'),
      );
      expect(complexity3?.value).toBe(2);

      expect(result.collectionGrowth).toHaveLength(2);
      expect(result.collectionGrowth[0].y).toBe(2);
      expect(result.collectionGrowth[1].y).toBe(1);
    });

    it('should return empty stats when collection is empty', async () => {
      const execMock = vi.fn().mockResolvedValue([]);
      mockBoardGameModel.find.mockReturnValue({ exec: execMock });

      const result = await service.getStats();

      expect(result.totalGames).toBe(0);
      expect(result.gamesByCategory).toHaveLength(0);
      expect(result.complexityDistribution).toHaveLength(0);
      expect(result.collectionGrowth).toHaveLength(0);
    });

    it('should handle games without categories or complexity', async () => {
      const mockGames = [
        {
          _id: '1',
          name: 'Simple Game',
          categories: undefined,
          complexity: undefined,
          createdAt: new Date('2024-01-15'),
        },
        {
          _id: '2',
          name: 'Complex Game',
          categories: ['Strategy'],
          complexity: 5,
          createdAt: new Date('2024-01-16'),
        },
      ];

      const execMock = vi.fn().mockResolvedValue(mockGames);
      mockBoardGameModel.find.mockReturnValue({ exec: execMock });

      const result = await service.getStats();

      expect(result.totalGames).toBe(2);
      expect(result.gamesByCategory).toHaveLength(1);
      expect(result.complexityDistribution).toHaveLength(1);
      expect(result.collectionGrowth).toHaveLength(1);
    });
  });
});
