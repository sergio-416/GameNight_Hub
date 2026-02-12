import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { getModelToken } from '@nestjs/mongoose';
import { Location } from '../infrastructure/persistence/mongodb/location.schema';
import { CreateLocationDto } from '../presentation/dto/create-location.dto';
import { UpdateLocationDto } from '../presentation/dto/update-location.dto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('LocationsService', () => {
  let service: LocationsService;

  const mockLocationModel = {
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
        LocationsService,
        {
          provide: getModelToken(Location.name),
          useValue: mockLocationModel,
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    vi.clearAllMocks();
  });

  describe('create location', () => {
    it('should persist new game night location to database', async () => {
      const createDto: CreateLocationDto = {
        name: 'Board Game Cafe Barcelona',
        latitude: 41.3851,
        longitude: 2.1734,
        address: 'Carrer de la Princesa, 1',
        venueType: 'cafe',
        capacity: 20,
        amenities: ['WiFi', 'Food', 'Drinks'],
      };

      const savedLocation = {
        _id: '507f1f77bcf86cd799439011',
        ...createDto,
        createdAt: new Date(),
      };

      mockLocationModel.create.mockResolvedValue(savedLocation);

      const result = await service.create(createDto);

      expect(result).toEqual(savedLocation);
      expect(mockLocationModel.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('find all locations', () => {
    it('should return all persisted locations from database', async () => {
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

      const mockExec = vi.fn().mockResolvedValue(mockLocations);
      mockLocationModel.find.mockReturnValue({ exec: mockExec });

      const result = await service.findAll();

      expect(result).toEqual(mockLocations);
      expect(result).toHaveLength(2);
      expect(mockLocationModel.find).toHaveBeenCalled();
    });

    it('should return empty array when database has no locations', async () => {
      const mockExec = vi.fn().mockResolvedValue([]);
      mockLocationModel.find.mockReturnValue({ exec: mockExec });

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('find one location', () => {
    it('should return location by id from database', async () => {
      const mockLocation = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Board Game Cafe',
        latitude: 41.3851,
        longitude: 2.1734,
        venueType: 'cafe',
      };

      const mockExec = vi.fn().mockResolvedValue(mockLocation);
      mockLocationModel.findById.mockReturnValue({ exec: mockExec });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockLocation);
      expect(mockLocationModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should return null when location id not found', async () => {
      const mockExec = vi.fn().mockResolvedValue(null);
      mockLocationModel.findById.mockReturnValue({ exec: mockExec });

      const result = await service.findOne('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('update location', () => {
    it('should update location fields in database', async () => {
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

      const mockExec = vi.fn().mockResolvedValue(updatedLocation);
      mockLocationModel.findByIdAndUpdate.mockReturnValue({ exec: mockExec });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateDto,
      );

      expect(result).toEqual(updatedLocation);
      expect(mockLocationModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateDto,
        { new: true },
      );
    });
  });

  describe('remove location', () => {
    it('should delete location from database', async () => {
      const deletedLocation = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Closed Cafe',
      };

      const mockExec = vi.fn().mockResolvedValue(deletedLocation);
      mockLocationModel.findByIdAndDelete.mockReturnValue({ exec: mockExec });

      const result = await service.remove('507f1f77bcf86cd799439011');

      expect(result).toEqual(deletedLocation);
      expect(mockLocationModel.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });
  });

  describe('find locations in bounds', () => {
    it('should return only locations within bounding box coordinates', async () => {
      const swLat = 41.3;
      const swLng = 2.1;
      const neLat = 41.5;
      const neLng = 2.2;

      const locationsInBounds = [
        { _id: '1', name: 'Cafe Inside', latitude: 41.38, longitude: 2.15 },
        { _id: '2', name: 'Store Inside', latitude: 41.4, longitude: 2.18 },
      ];

      const mockExec = vi.fn().mockResolvedValue(locationsInBounds);
      mockLocationModel.find.mockReturnValue({ exec: mockExec });

      const result = await service.findInBounds(swLat, swLng, neLat, neLng);

      expect(result).toEqual(locationsInBounds);
      expect(result).toHaveLength(2);
      expect(mockLocationModel.find).toHaveBeenCalledWith({
        latitude: { $gte: swLat, $lte: neLat },
        longitude: { $gte: swLng, $lte: neLng },
      });
    });

    it('should return empty array when no locations in specified bounds', async () => {
      const mockExec = vi.fn().mockResolvedValue([]);
      mockLocationModel.find.mockReturnValue({ exec: mockExec });

      const result = await service.findInBounds(0, 0, 0, 0);

      expect(result).toEqual([]);
    });

    it('should filter by venue types when provided', async () => {
      const swLat = 41.3;
      const swLng = 2.1;
      const neLat = 41.5;
      const neLng = 2.2;
      const venueTypes = ['cafe', 'store'];

      const mockExec = vi.fn().mockResolvedValue([]);
      mockLocationModel.find.mockReturnValue({ exec: mockExec });

      await service.findInBounds(swLat, swLng, neLat, neLng, venueTypes);

      expect(mockLocationModel.find).toHaveBeenCalledWith({
        latitude: { $gte: swLat, $lte: neLat },
        longitude: { $gte: swLng, $lte: neLng },
        venueType: { $in: venueTypes },
      });
    });
  });
});
