import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { GamesService } from './games';
import { API_CONFIG } from '@core/config/api.config';
import { Game, BggSearchResult, PersonalFields } from '../models/game.model';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('GamesService', () => {
	let service: GamesService;
	let httpMock: HttpTestingController;

	const apiUrl = API_CONFIG.baseUrl;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [GamesService, provideHttpClient(), provideHttpClientTesting()],
		});
		service = TestBed.inject(GamesService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	describe('searchBgg', () => {
		it('should return search results from BGG', () => {
			const mockResults: BggSearchResult[] = [{ bggId: 13, name: 'Catan', yearPublished: 1995 }];

			service.searchBgg('catan').subscribe((results: BggSearchResult[]) => {
				expect(results).toEqual(mockResults);
			});

			const req = httpMock.expectOne(`${apiUrl}/games/bgg/search?query=catan`);
			expect(req.request.method).toBe('GET');
			req.flush(mockResults);
		});
	});

	describe('getAllGames', () => {
		it('should return all games in collection', () => {
			const mockGames: Game[] = [
				{ _id: '1', name: 'Catan', bggId: 13, owned: true },
				{ _id: '2', name: 'Ticket to Ride', bggId: 42, owned: false },
			];

			service.getAllGames().subscribe((games: Game[]) => {
				expect(games).toEqual(mockGames);
				expect(games.length).toBe(2);
			});

			const req = httpMock.expectOne(`${apiUrl}/games`);
			expect(req.request.method).toBe('GET');
			req.flush(mockGames);
		});
	});

	describe('importGame', () => {
		it('should import game from BGG', () => {
			const mockGame: Game = {
				_id: 'mongo-id-123',
				bggId: 13,
				name: 'Catan',
				owned: true,
				notes: 'My favorite!',
			};

			const personalFields: PersonalFields = {
				owned: true,
				notes: 'My favorite!',
				complexity: 3,
			};

			service.importGame(13, personalFields).subscribe((game: Game) => {
				expect(game).toEqual(mockGame);
				expect(game.bggId).toBe(13);
			});

			const req = httpMock.expectOne(`${apiUrl}/games/import/13`);
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toEqual(personalFields);
			req.flush(mockGame);
		});
	});

	describe('getStats', () => {
		it('should return statistics from backend', () => {
			const mockStats = {
				gamesByCategory: [
					{ name: 'Strategy', value: 5 },
					{ name: 'Family', value: 3 },
				],
				complexityDistribution: [
					{ name: '1 - Light', value: 2 },
					{ name: '3 - Medium', value: 4 },
				],
				collectionGrowth: [
					{ x: '2024-01', y: 1 },
					{ x: '2024-02', y: 3 },
				],
				totalGames: 10,
			};

			service.getStats().subscribe((stats) => {
				expect(stats).toEqual(mockStats);
				expect(stats.totalGames).toBe(10);
				expect(stats.gamesByCategory.length).toBe(2);
			});

			const req = httpMock.expectOne(`${apiUrl}/games/stats`);
			expect(req.request.method).toBe('GET');
			req.flush(mockStats);
		});
	});
});
