import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LocationsService } from '../application/locations.service';

describe('LocationsController', () => {
  let controller: LocationsController;

  const mockLocationsService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    findInBounds: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        { provide: LocationsService, useValue: mockLocationsService },
      ],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
    vi.clearAllMocks();
  });

  describe('create location', () => {
    it('should create a new game night location when valid data provided', async () => {
      const createDto: CreateLocationDto = {
        name: 'Board Game Cafe Barcelona',
        latitude: 41.3851,
        longitude: 2.1734,
        address: 'Carrer de la Princesa, 1',
        venueType: 'cafe',
        capacity: 20,
        amenities: ['WiFi', 'Food', 'Drinks'],
      };

      const expectedLocation = {
        _id: '507f1f77bcf86cd799439011',
        ...createDto,
        createdAt: new Date(),
      };

      mockLocationsService.create.mockResolvedValue(expectedLocation);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedLocation);
      expect(mockLocationsService.create).toHaveBeenCalledWith(createDto);
      expect(mockLocationsService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('find all locations', () => {
    it('should return list of all game night locations', async () => {
      const mockLocations = [
        {
          _id: '1',
          name: 'Board Game Cafe',
          latitude: 41.3851,
          longitude: 2.1734,
          venueType: 'cafe',
        },
        {
          _id: '2',
          name: 'Game Store Central',
          latitude: 41.4,
          longitude: 2.18,
          venueType: 'store',
        },
      ];

      mockLocationsService.findAll.mockResolvedValue(mockLocations);

      const result = await controller.findAll();

      expect(result).toEqual(mockLocations);
      expect(result).toHaveLength(2);
      expect(mockLocationsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no locations exist', async () => {
      mockLocationsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('find one location', () => {
    it('should return single location when valid id provided', async () => {
      const mockLocation = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Board Game Cafe',
        latitude: 41.3851,
        longitude: 2.1734,
        venueType: 'cafe',
      };

      mockLocationsService.findOne.mockResolvedValue(mockLocation);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockLocation);
      expect(mockLocationsService.findOne).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should return null when location not found', async () => {
      mockLocationsService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('update location', () => {
    it('should update location when valid data provided', async () => {
      const updateDto: UpdateLocationDto = {
        name: 'Updated Cafe Name',
        capacity: 25,
      };

      const updatedLocation = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Updated Cafe Name',
        latitude: 41.3851,
        longitude: 2.1734,
        venueType: 'cafe',
        capacity: 25,
        updatedAt: new Date(),
      };

      mockLocationsService.update.mockResolvedValue(updatedLocation);

      const result = await controller.update(
        '507f1f77bcf86cd799439011',
        updateDto,
      );

      expect(result).toEqual(updatedLocation);
      expect(mockLocationsService.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateDto,
      );
    });
  });

  describe('remove location', () => {
    it('should remove location when valid id provided', async () => {
      const deletedLocation = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Closed Cafe',
      };

      mockLocationsService.remove.mockResolvedValue(deletedLocation);

      const result = await controller.remove('507f1f77bcf86cd799439011');

      expect(result).toEqual(deletedLocation);
      expect(mockLocationsService.remove).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });
  });

  describe('find locations in bounds', () => {
    it('should return only locations within specified bounding box', async () => {
      const swLat = 41.3;
      const swLng = 2.1;
      const neLat = 41.5;
      const neLng = 2.2;

      const locationsInBounds = [
        { _id: '1', name: 'Cafe Inside', latitude: 41.38, longitude: 2.15 },
        { _id: '2', name: 'Store Inside', latitude: 41.4, longitude: 2.18 },
      ];

      mockLocationsService.findInBounds.mockResolvedValue(locationsInBounds);

      const result = await controller.findInBounds(
        swLat.toString(),
        swLng.toString(),
        neLat.toString(),
        neLng.toString(),
      );

      expect(result).toEqual(locationsInBounds);
      expect(result).toHaveLength(2);
      expect(mockLocationsService.findInBounds).toHaveBeenCalledWith(
        swLat,
        swLng,
        neLat,
        neLng,
        [],
      );
    });

    it('should return empty array when no locations in bounds', async () => {
      mockLocationsService.findInBounds.mockResolvedValue([]);

      const result = await controller.findInBounds('0', '0', '0', '0');

      expect(result).toEqual([]);
    });

    it('should filter by venue types when provided', async () => {
      const swLat = 41.3;
      const swLng = 2.1;
      const neLat = 41.5;
      const neLng = 2.2;
      const venueType = 'cafe,store';

      mockLocationsService.findInBounds.mockResolvedValue([]);

      await controller.findInBounds(
        swLat.toString(),
        swLng.toString(),
        neLat.toString(),
        neLng.toString(),
        venueType,
      );

      expect(mockLocationsService.findInBounds).toHaveBeenCalledWith(
        swLat,
        swLng,
        neLat,
        neLng,
        ['cafe', 'store'],
      );
    });
  });
});
