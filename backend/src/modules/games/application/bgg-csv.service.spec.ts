import { Test, TestingModule } from '@nestjs/testing';
import { BggCsvService } from './bgg-csv.service';

describe('BggCsvService', () => {
  let service: BggCsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BggCsvService],
    }).compile();

    await module.init();

    service = module.get<BggCsvService>(BggCsvService);
  });

  afterEach(async () => {});

  describe('onModuleInit', () => {
    it('should load CSV data on initialization', () => {
      expect(service).toBeDefined();
      const results = service.search('Catan');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('search', () => {
    it('should return games matching the search query', () => {
      const results = service.search('Catan');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('id');
      expect(results[0]).toHaveProperty('name');
      expect(results[0]).toHaveProperty('yearpublished');
      expect(results[0]).toHaveProperty('rank');
      expect(results[0].name.toLowerCase()).toContain('catan');
    });

    it('should return empty array when no matches found', () => {
      const results = service.search('NonExistentGame12345');

      expect(results).toEqual([]);
    });

    it('should perform case-insensitive search', () => {
      const lowerCase = service.search('catan');
      const upperCase = service.search('CATAN');
      const mixedCase = service.search('CaTaN');

      expect(lowerCase.length).toBeGreaterThan(0);
      expect(upperCase.length).toEqual(lowerCase.length);
      expect(mixedCase.length).toEqual(lowerCase.length);
    });

    it('should limit results to prevent overwhelming responses', () => {
      const results = service.search('a');

      expect(results.length).toBeLessThanOrEqual(50);
    });
  });

  describe('getById', () => {
    it('should return game by BGG ID', () => {
      const game = service.getById('13');

      expect(game).toBeDefined();
      expect(game?.name).toBeDefined();
      expect(game?.name?.toLowerCase()).toContain('catan');
    });

    it('should return undefined for non-existent ID', () => {
      const game = service.getById('999999999');

      expect(game).toBeUndefined();
    });
  });
});
