import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from '@events/infrastructure/persistence/mongodb/event.schema';
import { CreateEventDto } from '@events/presentation/dto/create-event.dto';
import { UpdateEventDto } from '@events/presentation/dto/update-event.dto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('EventsService', () => {
  let service: EventsService;

  const mockEventModel = {
    create: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    findOne: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    vi.clearAllMocks();
  });

  describe('create event', () => {
    it('should persist new game night event to database', async () => {
      const createDto: CreateEventDto = {
        title: 'Catan Night at the Cafe',
        gameId: '507f1f77bcf86cd799439011',
        locationId: '507f1f77bcf86cd799439022',
        startTime: '2026-02-15T19:00:00Z',
        maxPlayers: 4,
      };

      const savedEvent = {
        _id: '507f1f77bcf86cd799439033',
        ...createDto,
        createdAt: new Date(),
      };

      mockEventModel.create.mockResolvedValue(savedEvent);

      const result = await service.create(createDto);

      expect(result).toEqual(savedEvent);
      expect(mockEventModel.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('find all events', () => {
    it('should return all persisted events from database', async () => {
      const mockEvents = [
        {
          _id: '1',
          title: 'Catan Night',
          gameId: '507f1f77bcf86cd799439011',
          locationId: '507f1f77bcf86cd799439022',
          startTime: new Date(),
        },
        {
          _id: '2',
          title: 'Ticket to Ride',
          gameId: '507f1f77bcf86cd799439044',
          locationId: '507f1f77bcf86cd799439022',
          startTime: new Date(),
        },
      ];

      const mockExec = vi.fn().mockResolvedValue(mockEvents);
      mockEventModel.find.mockReturnValue({ exec: mockExec });

      const result = await service.findAll();

      expect(result).toEqual(mockEvents);
      expect(result).toHaveLength(2);
      expect(mockEventModel.find).toHaveBeenCalled();
    });

    it('should return empty array when database has no events', async () => {
      const mockExec = vi.fn().mockResolvedValue([]);
      mockEventModel.find.mockReturnValue({ exec: mockExec });

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('find one event', () => {
    it('should return event by id from database', async () => {
      const mockEvent = {
        _id: '507f1f77bcf86cd799439033',
        title: 'Catan Night',
        gameId: '507f1f77bcf86cd799439011',
        locationId: '507f1f77bcf86cd799439022',
        startTime: new Date(),
      };

      const mockExec = vi.fn().mockResolvedValue(mockEvent);
      mockEventModel.findById.mockReturnValue({ exec: mockExec });

      const result = await service.findOne('507f1f77bcf86cd799439033');

      expect(result).toEqual(mockEvent);
      expect(mockEventModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439033',
      );
    });

    it('should return null when event id not found', async () => {
      const mockExec = vi.fn().mockResolvedValue(null);
      mockEventModel.findById.mockReturnValue({ exec: mockExec });

      const result = await service.findOne('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('update event', () => {
    it('should update event fields in database', async () => {
      const updateDto: UpdateEventDto = {
        title: 'Updated Catan Night',
        maxPlayers: 6,
      };

      const updatedEvent = {
        _id: '507f1f77bcf86cd799439033',
        title: 'Updated Catan Night',
        gameId: '507f1f77bcf86cd799439011',
        locationId: '507f1f77bcf86cd799439022',
        startTime: new Date(),
        maxPlayers: 6,
        updatedAt: new Date(),
      };

      const mockExec = vi.fn().mockResolvedValue(updatedEvent);
      mockEventModel.findByIdAndUpdate.mockReturnValue({ exec: mockExec });

      const result = await service.update(
        '507f1f77bcf86cd799439033',
        updateDto,
      );

      expect(result).toEqual(updatedEvent);
      expect(mockEventModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439033',
        updateDto,
        { new: true },
      );
    });
  });

  describe('remove event', () => {
    it('should delete event from database', async () => {
      const deletedEvent = {
        _id: '507f1f77bcf86cd799439033',
        title: 'Deleted Event',
      };

      const mockExec = vi.fn().mockResolvedValue(deletedEvent);
      mockEventModel.findByIdAndDelete.mockReturnValue({ exec: mockExec });

      const result = await service.remove('507f1f77bcf86cd799439033');

      expect(result).toEqual(deletedEvent);
      expect(mockEventModel.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439033',
      );
    });
  });
});
