import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { Location, LocationSchema, LocationDocument } from './location.schema';

describe('Location Schema', () => {
  let mongoServer: MongoMemoryServer;
  let moduleRef: TestingModule;
  let locationModel: Model<LocationDocument>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([
          { name: Location.name, schema: LocationSchema },
        ]),
      ],
    }).compile();

    locationModel = moduleRef.get<Model<LocationDocument>>(
      getModelToken(Location.name),
    );
  }, 30000);

  afterAll(async () => {
    await moduleRef.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await locationModel.deleteMany({});
  });

  describe('when creating a valid location', () => {
    it('should store location with name, coordinates, and venue type', async () => {
      const locationData = {
        name: 'Board Game Cafe Barcelona',
        latitude: 41.3851,
        longitude: 2.1734,
        address: 'Carrer de la Princesa, 1',
        venueType: 'cafe',
        capacity: 20,
        amenities: ['WiFi', 'Food', 'Drinks'],
        description: 'Best board game cafe in town!',
        hostName: 'John Doe',
      };

      const createdLocation = await locationModel.create(locationData);

      expect(createdLocation.name).toBe('Board Game Cafe Barcelona');
      expect(createdLocation.latitude).toBe(41.3851);
      expect(createdLocation.longitude).toBe(2.1734);
      expect(createdLocation.venueType).toBe('cafe');
      expect(createdLocation.capacity).toBe(20);
      expect(createdLocation.amenities).toEqual(['WiFi', 'Food', 'Drinks']);
    });

    it('should reject location without required name', async () => {
      const invalidLocation = {
        latitude: 41.3851,
        longitude: 2.1734,
      };

      await expect(locationModel.create(invalidLocation)).rejects.toThrow();
    });

    it('should reject location without required latitude', async () => {
      const invalidLocation = {
        name: 'Test Cafe',
        longitude: 2.1734,
      };

      await expect(locationModel.create(invalidLocation)).rejects.toThrow();
    });

    it('should reject location without required longitude', async () => {
      const invalidLocation = {
        name: 'Test Cafe',
        latitude: 41.3851,
      };

      await expect(locationModel.create(invalidLocation)).rejects.toThrow();
    });
  });

  describe('when querying locations', () => {
    it('should find locations by venue type', async () => {
      await locationModel.create([
        {
          name: 'Cafe 1',
          latitude: 41.3851,
          longitude: 2.1734,
          venueType: 'cafe',
        },
        {
          name: 'Store 1',
          latitude: 41.4,
          longitude: 2.18,
          venueType: 'store',
        },
      ]);

      const cafeLocations = await locationModel.find({ venueType: 'cafe' });

      expect(cafeLocations).toHaveLength(1);
      expect(cafeLocations[0].name).toBe('Cafe 1');
    });

    it('should find locations within bounding box', async () => {
      await locationModel.create([
        {
          name: 'Inside Box',
          latitude: 41.38,
          longitude: 2.15,
          venueType: 'cafe',
        },
        {
          name: 'Outside Box',
          latitude: 40.0,
          longitude: 2.0,
          venueType: 'cafe',
        },
      ]);

      const locationsInBounds = await locationModel.find({
        latitude: { $gte: 41.0, $lte: 42.0 },
        longitude: { $gte: 2.0, $lte: 3.0 },
      });

      expect(locationsInBounds).toHaveLength(1);
      expect(locationsInBounds[0].name).toBe('Inside Box');
    });
  });
});
