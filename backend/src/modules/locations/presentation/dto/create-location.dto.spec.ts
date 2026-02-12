import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateLocationDto } from './create-location.dto';

describe('CreateLocationDto', () => {
  describe('when creating a valid location', () => {
    it('should accept valid location data with all required fields', async () => {
      const dto = plainToInstance(CreateLocationDto, {
        name: 'Board Game Cafe Barcelona',
        latitude: 41.3851,
        longitude: 2.1734,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept valid optional fields', async () => {
      const dto = plainToInstance(CreateLocationDto, {
        name: 'Game Store Central',
        latitude: 41.4,
        longitude: 2.18,
        address: 'Main Street 123',
        venueType: 'store',
        capacity: 50,
        amenities: ['WiFi', 'Food', 'Drinks', 'Parking'],
        description: 'Best board game store in town!',
        hostName: 'John Doe',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('when validation fails', () => {
    it('should reject location without name', async () => {
      const dto = plainToInstance(CreateLocationDto, {
        latitude: 41.3851,
        longitude: 2.1734,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should reject location without latitude', async () => {
      const dto = plainToInstance(CreateLocationDto, {
        name: 'Test Cafe',
        longitude: 2.1734,
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'latitude')).toBe(true);
    });

    it('should reject location without longitude', async () => {
      const dto = plainToInstance(CreateLocationDto, {
        name: 'Test Cafe',
        latitude: 41.3851,
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'longitude')).toBe(true);
    });

    it('should reject location with invalid latitude (out of range)', async () => {
      const dto = plainToInstance(CreateLocationDto, {
        name: 'Invalid Location',
        latitude: 100,
        longitude: 2.1734,
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'latitude')).toBe(true);
    });

    it('should reject location with invalid longitude (out of range)', async () => {
      const dto = plainToInstance(CreateLocationDto, {
        name: 'Invalid Location',
        latitude: 41.3851,
        longitude: 200,
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'longitude')).toBe(true);
    });

    it('should reject location with invalid venueType', async () => {
      const dto = plainToInstance(CreateLocationDto, {
        name: 'Test Location',
        latitude: 41.3851,
        longitude: 2.1734,
        venueType: 'invalid_type',
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'venueType')).toBe(true);
    });

    it('should reject location with capacity less than 1', async () => {
      const dto = plainToInstance(CreateLocationDto, {
        name: 'Test Location',
        latitude: 41.3851,
        longitude: 2.1734,
        capacity: 0,
      });

      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'capacity')).toBe(true);
    });
  });
});
