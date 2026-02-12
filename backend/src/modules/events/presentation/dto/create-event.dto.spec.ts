import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateEventDto } from './create-event.dto';

describe('CreateEventDto', () => {
  describe('when creating a valid event', () => {
    it('should accept valid event data with all required fields', async () => {
      const dto = plainToInstance(CreateEventDto, {
        title: 'Catan Night at the Cafe',
        gameId: '507f1f77bcf86cd799439011',
        locationId: '507f1f77bcf86cd799439022',
        startTime: '2026-02-15T19:00:00Z',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept valid optional fields', async () => {
      const dto = plainToInstance(CreateEventDto, {
        title: 'Game Night',
        gameId: '507f1f77bcf86cd799439011',
        locationId: '507f1f77bcf86cd799439022',
        startTime: '2026-02-15T19:00:00Z',
        endTime: '2026-02-15T23:00:00Z',
        maxPlayers: 6,
        description: 'Bring your own snacks!',
        color: '#4F46E5',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('when validation fails', () => {
    it('should reject event without title', async () => {
      const dto = plainToInstance(CreateEventDto, {
        gameId: '507f1f77bcf86cd799439011',
        locationId: '507f1f77bcf86cd799439022',
        startTime: '2026-02-15T19:00:00Z',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should reject event without gameId', async () => {
      const dto = plainToInstance(CreateEventDto, {
        title: 'Game Night',
        locationId: '507f1f77bcf86cd799439022',
        startTime: '2026-02-15T19:00:00Z',
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'gameId')).toBe(true);
    });

    it('should reject event without locationId', async () => {
      const dto = plainToInstance(CreateEventDto, {
        title: 'Game Night',
        gameId: '507f1f77bcf86cd799439011',
        startTime: '2026-02-15T19:00:00Z',
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'locationId')).toBe(true);
    });

    it('should reject event without startTime', async () => {
      const dto = plainToInstance(CreateEventDto, {
        title: 'Game Night',
        gameId: '507f1f77bcf86cd799439011',
        locationId: '507f1f77bcf86cd799439022',
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'startTime')).toBe(true);
    });

    it('should reject event with empty title', async () => {
      const dto = plainToInstance(CreateEventDto, {
        title: '',
        gameId: '507f1f77bcf86cd799439011',
        locationId: '507f1f77bcf86cd799439022',
        startTime: '2026-02-15T19:00:00Z',
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'title')).toBe(true);
    });
  });
});
