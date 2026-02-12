import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model, Types } from 'mongoose';
import { Event, EventSchema, EventDocument } from './event.schema';

describe('Event Schema', () => {
  let mongoServer: MongoMemoryServer;
  let moduleRef: TestingModule;
  let eventModel: Model<EventDocument>;

  const validGameId = new Types.ObjectId('507f1f77bcf86cd799439011');
  const validLocationId = new Types.ObjectId('507f1f77bcf86cd799439022');

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
      ],
    }).compile();

    eventModel = moduleRef.get<Model<EventDocument>>(getModelToken(Event.name));
  }, 30000);

  afterAll(async () => {
    if (moduleRef) await moduleRef.close();
    if (mongoServer) await mongoServer.stop();
  });

  afterEach(async () => {
    await eventModel.deleteMany({});
  });

  describe('when creating a game night event', () => {
    it('should store event with title, game, location, and time', async () => {
      const eventData = {
        title: 'Catan Night at the Cafe',
        gameId: validGameId,
        locationId: validLocationId,
        startTime: new Date('2026-02-15T19:00:00Z'),
        endTime: new Date('2026-02-15T23:00:00Z'),
        maxPlayers: 4,
        description: 'Bring your strategy A-game!',
        color: '#4F46E5',
      };

      const createdEvent = await eventModel.create(eventData);

      expect(createdEvent.title).toBe('Catan Night at the Cafe');
      expect(createdEvent.gameId.toString()).toBe(validGameId.toString());
      expect(createdEvent.locationId.toString()).toBe(
        validLocationId.toString(),
      );
      expect(createdEvent.startTime).toEqual(new Date('2026-02-15T19:00:00Z'));
      expect(createdEvent.maxPlayers).toBe(4);
      expect(createdEvent.description).toBe('Bring your strategy A-game!');
      expect(createdEvent.color).toBe('#4F46E5');
    });

    it('should reject event without required title', async () => {
      const invalidEvent = {
        gameId: validGameId,
        locationId: validLocationId,
        startTime: new Date(),
      };

      await expect(eventModel.create(invalidEvent)).rejects.toThrow();
    });

    it('should reject event without required startTime', async () => {
      const invalidEvent = {
        title: 'Test Event',
        gameId: validGameId,
        locationId: validLocationId,
      };

      await expect(eventModel.create(invalidEvent)).rejects.toThrow();
    });

    it('should set default timestamps on creation', async () => {
      const beforeCreation = new Date();

      const event = await eventModel.create({
        title: 'Test Event',
        gameId: validGameId,
        locationId: validLocationId,
        startTime: new Date(),
      });

      expect(event.createdAt).toBeDefined();
      expect(event.updatedAt).toBeDefined();
      expect(event.createdAt!.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
    });
  });

  describe('when querying events', () => {
    it('should find events by gameId', async () => {
      await eventModel.create([
        {
          title: 'Catan Night 1',
          gameId: validGameId,
          locationId: validLocationId,
          startTime: new Date(),
        },
        {
          title: 'Ticket to Ride Night',
          gameId: new Types.ObjectId('507f1f77bcf86cd799439033'),
          locationId: validLocationId,
          startTime: new Date(),
        },
      ]);

      const catanEvents = await eventModel.find({ gameId: validGameId });

      expect(catanEvents).toHaveLength(1);
      expect(catanEvents[0].title).toBe('Catan Night 1');
    });

    it('should find upcoming events sorted by startTime', async () => {
      const now = new Date();
      await eventModel.create([
        {
          title: 'Future Event',
          gameId: validGameId,
          locationId: validLocationId,
          startTime: new Date(now.getTime() + 86400000),
        },
        {
          title: 'Past Event',
          gameId: validGameId,
          locationId: validLocationId,
          startTime: new Date(now.getTime() - 86400000),
        },
      ]);

      const upcomingEvents = await eventModel
        .find({ startTime: { $gte: now } })
        .sort({ startTime: 1 });

      expect(upcomingEvents).toHaveLength(1);
      expect(upcomingEvents[0].title).toBe('Future Event');
    });
  });
});
