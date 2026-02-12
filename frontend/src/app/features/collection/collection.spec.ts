import { vi } from 'vitest';
import { of } from 'rxjs';
import { GamesService } from './services/games';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Collection } from './collection';
import { beforeEach, expect, describe, it } from 'vitest';

describe('Collection', () => {
	let fixture: ComponentFixture<Collection>;

	const mockGamesService = {
		getAllGames: vi.fn().mockReturnValue(of([])),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Collection],
			providers: [{ provide: GamesService, useValue: mockGamesService }],
		}).compileComponents();

		fixture = TestBed.createComponent(Collection);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('page display', () => {
		it('should render collection page when component loads', () => {
			fixture.detectChanges();

			const compiled = fixture.nativeElement;
			expect(compiled).toBeTruthy();
		});

		it('should display game-list component in the page', () => {
			fixture.detectChanges();

			const gameListComponent = fixture.nativeElement.querySelector('app-game-list');
			expect(gameListComponent).toBeTruthy();
		});
	});
});
