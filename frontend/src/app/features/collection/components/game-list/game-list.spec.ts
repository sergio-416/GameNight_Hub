import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, afterEach, expect, vi, describe, it } from 'vitest';
import { GameList } from './game-list';
import { GamesService } from '../../services/games';
import { Game } from '../../models/game.model';

describe('GameList', () => {
	let component: GameList;
	let fixture: ComponentFixture<GameList>;

	const mockGamesService = {
		getAllGames: vi.fn(),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GameList],
			providers: [{ provide: GamesService, useValue: mockGamesService }],
		}).compileComponents();

		fixture = TestBed.createComponent(GameList);
		component = fixture.componentInstance;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('display games', () => {
		it('should display list of games when games exist in collection', () => {
			const mockGames: Game[] = [
				{ _id: '1', name: 'Catan', bggId: 13, owned: true, yearPublished: 1995 },
				{ _id: '2', name: 'Ticket to Ride', bggId: 42, owned: false, yearPublished: 2004 },
			];

			mockGamesService.getAllGames.mockReturnValue(of(mockGames));
			fixture.detectChanges();

			const compiled = fixture.nativeElement as HTMLElement;
			const gameElements = compiled.querySelectorAll('[data-testid="game-item"]');

			expect(gameElements.length).toBe(2);
			expect(compiled.textContent).toContain('Catan');
			expect(compiled.textContent).toContain('Ticket to Ride');
		});

		it('should display empty state message when no games in collection', () => {
			mockGamesService.getAllGames.mockReturnValue(of([]));
			fixture.detectChanges();

			const compiled = fixture.nativeElement as HTMLElement;

			expect(compiled.textContent).toContain('No games yet');
			expect(compiled.textContent).toContain('Import your first game');
		});

		it('should handle loading state while fetching games', () => {
			mockGamesService.getAllGames.mockReturnValue(of([]));
			fixture.detectChanges();

			expect(component.loading()).toBe(false);
		});
	});
});
