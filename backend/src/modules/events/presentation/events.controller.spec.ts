import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from '../application/events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('EventsController', () => {
  let controller: EventsController;

  const mockEventsService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [{ provide: EventsService, useValue: mockEventsService }],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    vi.clearAllMocks();
  });

  describe('create event', () => {
    it('should create a new game night event when valid data provided', async () => {
      const createDto: CreateEventDto = {
        title: 'Catan Night at the Cafe',
        gameId: '507f1f77bcf86cd799439011',
        locationId: '507f1f77bcf86cd799439022',
        startTime: '2026-02-15T19:00:00Z',
        maxPlayers: 4,
      };

      const expectedEvent = {
        _id: '507f1f77bcf86cd799439033',
        ...createDto,
        createdAt: new Date(),
      };

      mockEventsService.create.mockResolvedValue(expectedEvent);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedEvent);
      expect(mockEventsService.create).toHaveBeenCalledWith(createDto);
      expect(mockEventsService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('find all events', () => {
    it('should return list of all game night events', async () => {
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

      mockEventsService.findAll.mockResolvedValue(mockEvents);

      const result = await controller.findAll();

      expect(result).toEqual(mockEvents);
      expect(result).toHaveLength(2);
      expect(mockEventsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no events exist', async () => {
      mockEventsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('find one event', () => {
    it('should return single event when valid id provided', async () => {
      const mockEvent = {
        _id: '507f1f77bcf86cd799439033',
        title: 'Catan Night',
        gameId: '507f1f77bcf86cd799439011',
        locationId: '507f1f77bcf86cd799439022',
        startTime: new Date(),
      };

      mockEventsService.findOne.mockResolvedValue(mockEvent);

      const result = await controller.findOne('507f1f77bcf86cd799439033');

      expect(result).toEqual(mockEvent);
      expect(mockEventsService.findOne).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439033',
      );
    });

    it('should return null when event not found', async () => {
      mockEventsService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('update event', () => {
    it('should update event when valid data provided', async () => {
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

      mockEventsService.update.mockResolvedValue(updatedEvent);

      const result = await controller.update(
        '507f1f77bcf86cd799439033',
        updateDto,
      );

      expect(result).toEqual(updatedEvent);
      expect(mockEventsService.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439033',
        updateDto,
      );
    });
  });

  describe('remove event', () => {
    it('should remove event when valid id provided', async () => {
      const deletedEvent = {
        _id: '507f1f77bcf86cd799439033',
        title: 'Deleted Event',
      };

      mockEventsService.remove.mockResolvedValue(deletedEvent);

      const result = await controller.remove('507f1f77bcf86cd799439033');

      expect(result).toEqual(deletedEvent);
      expect(mockEventsService.remove).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439033',
      );
    });
  });
});
