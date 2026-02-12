import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { BoardGame, BoardGameSchema, BoardGameDocument } from './game.schema';

describe('BoardGame Schema', () => {
  let mongoServer: MongoMemoryServer;
  let moduleRef: TestingModule;
  let boardGameModel: Model<BoardGameDocument>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([
          { name: BoardGame.name, schema: BoardGameSchema },
        ]),
      ],
    }).compile();

    boardGameModel = moduleRef.get<Model<BoardGameDocument>>(
      getModelToken(BoardGame.name),
    );
  }, 30000);

  afterAll(async () => {
    await moduleRef.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await boardGameModel.deleteMany({});
  });

  describe('when creating a valid board game', () => {
    it('should store board game with name and owned status', async () => {
      const gameData = {
        name: 'Catan',
        bggId: 13,
        yearpublished: 1995,
        minplayers: 3,
        maxplayers: 4,
        playingtime: 60,
        minage: 10,
        description: 'Trade. Build. Settle.',
        categories: ['Strategy', 'Family'],
        mechanics: ['Trading', 'Dice Rolling'],
        publisher: 'Kosmos',
        owned: true,
        notes: 'Great gateway game!',
        complexity: 2.3,
      };

      const createdGame = await boardGameModel.create(gameData);

      expect(createdGame.name).toBe('Catan');
      expect(createdGame.bggId).toBe(13);
      expect(createdGame.yearpublished).toBe(1995);
      expect(createdGame.minplayers).toBe(3);
      expect(createdGame.maxplayers).toBe(4);
      expect(createdGame.owned).toBe(true);
      expect(createdGame.categories).toEqual(['Strategy', 'Family']);
      expect(createdGame.complexity).toBe(2.3);
    });

    it('should reject board game without required name', async () => {
      const invalidGame = {
        owned: true,
      };

      await expect(boardGameModel.create(invalidGame)).rejects.toThrow();
    });

    it('should set owned to false by default', async () => {
      const game = await boardGameModel.create({
        name: 'Unowned Game',
      });

      expect(game.owned).toBe(false);
    });

    it('should store game with optional fields as undefined', async () => {
      const minimalGame = {
        name: 'Minimal Game',
        owned: true,
      };

      const createdGame = await boardGameModel.create(minimalGame);

      expect(createdGame.name).toBe('Minimal Game');
      expect(createdGame.owned).toBe(true);
      expect(createdGame.bggId).toBeUndefined();
      expect(createdGame.yearpublished).toBeUndefined();
    });
  });

  describe('when querying board games', () => {
    it('should find games by owned status', async () => {
      await boardGameModel.create([
        {
          name: 'Catan',
          owned: true,
        },
        {
          name: 'Unplayed Game',
          owned: false,
        },
      ]);

      const ownedGames = await boardGameModel.find({ owned: true });

      expect(ownedGames).toHaveLength(1);
      expect(ownedGames[0].name).toBe('Catan');
    });

    it('should find games by categories', async () => {
      await boardGameModel.create([
        {
          name: 'Catan',
          owned: true,
          categories: ['Strategy', 'Family'],
        },
        {
          name: 'Azul',
          owned: true,
          categories: ['Abstract', 'Family'],
        },
      ]);

      const strategyGames = await boardGameModel.find({
        categories: 'Strategy',
      });

      expect(strategyGames).toHaveLength(1);
      expect(strategyGames[0].name).toBe('Catan');
    });

    it('should filter games by complexity range', async () => {
      await boardGameModel.create([
        {
          name: 'Simple Game',
          owned: true,
          complexity: 1.5,
        },
        {
          name: 'Complex Game',
          owned: true,
          complexity: 4.5,
        },
      ]);

      const lightGames = await boardGameModel.find({
        complexity: { $lte: 2.0 },
      });

      expect(lightGames).toHaveLength(1);
      expect(lightGames[0].name).toBe('Simple Game');
    });
  });
});
