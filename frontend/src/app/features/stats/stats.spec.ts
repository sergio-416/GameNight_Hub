import { vi } from 'vitest';

class ResizeObserverMock {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

Object.defineProperty(SVGElement.prototype, 'getBBox', {
	value: () => ({
		x: 0,
		y: 0,
		width: 100,
		height: 100,
	}),
	configurable: true,
});

vi.stubGlobal(
	'requestAnimationFrame',
	vi.fn((callback: FrameRequestCallback) => {
		return setTimeout(callback, 0) as unknown as number;
	}),
);
vi.stubGlobal(
	'cancelAnimationFrame',
	vi.fn((id: number) => {
		clearTimeout(id);
	}),
);
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { beforeEach, afterEach, expect, describe, it } from 'vitest';
import { Stats } from './stats';
import { API_CONFIG } from '@core/config/api.config';

describe('Stats', () => {
	let component: Stats;
	let fixture: ComponentFixture<Stats>;
	let httpMock: HttpTestingController;
	let appRef: ApplicationRef;

	const apiUrl = API_CONFIG.baseUrl;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Stats],
			providers: [provideHttpClient(), provideHttpClientTesting()],
		}).compileComponents();

		fixture = TestBed.createComponent(Stats);
		component = fixture.componentInstance;
		httpMock = TestBed.inject(HttpTestingController);
		appRef = TestBed.inject(ApplicationRef);
	});

	afterEach(() => {
		httpMock.verify();
		vi.clearAllMocks();
	});

	describe('display stats dashboard', () => {
		it('should render statistics dashboard when component loads', async () => {
			fixture.detectChanges();
			TestBed.tick();

			const req = httpMock.expectOne(`${apiUrl}/games/stats`);
			expect(req.request.method).toBe('GET');
			req.flush({
				gamesByCategory: [],
				complexityDistribution: [],
				collectionGrowth: [],
				totalGames: 0,
			});

			await appRef.whenStable();

			const compiled = fixture.nativeElement as HTMLElement;
			expect(compiled.querySelector('[data-testid="stats-dashboard"]')).toBeTruthy();
		});

		it('should fetch stats from backend on init', async () => {
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

			fixture.detectChanges();
			TestBed.tick();

			const req = httpMock.expectOne(`${apiUrl}/games/stats`);
			req.flush(mockStats);

			await appRef.whenStable();

			expect(component.totalGames()).toBe(10);
			expect(component.gamesByCategoryData().length).toBe(2);
		});

		it('should display charts when stats data exists', async () => {
			const mockStats = {
				gamesByCategory: [{ name: 'Strategy', value: 5 }],
				complexityDistribution: [{ name: '3 - Medium', value: 4 }],
				collectionGrowth: [{ x: '2024-01', y: 2 }],
				totalGames: 5,
			};

			fixture.detectChanges();
			TestBed.tick();

			const req = httpMock.expectOne(`${apiUrl}/games/stats`);
			req.flush(mockStats);

			await appRef.whenStable();

			const compiled = fixture.nativeElement as HTMLElement;
			expect(compiled.querySelector('[data-testid="games-by-category-chart"]')).toBeTruthy();
			expect(compiled.querySelector('[data-testid="collection-growth-chart"]')).toBeTruthy();
			expect(compiled.querySelector('[data-testid="complexity-distribution-chart"]')).toBeTruthy();
		});

		it('should display loading state while fetching data', async () => {
			fixture.detectChanges();
			TestBed.tick();

			expect(component.statsResource.isLoading()).toBe(true);

			const req = httpMock.expectOne(`${apiUrl}/games/stats`);
			req.flush({
				gamesByCategory: [],
				complexityDistribution: [],
				collectionGrowth: [],
				totalGames: 0,
			});

			await appRef.whenStable();

			expect(component.statsResource.isLoading()).toBe(false);
		});

		it('should display empty state when no games exist', async () => {
			fixture.detectChanges();
			TestBed.tick();

			const req = httpMock.expectOne(`${apiUrl}/games/stats`);
			req.flush({
				gamesByCategory: [],
				complexityDistribution: [],
				collectionGrowth: [],
				totalGames: 0,
			});

			await appRef.whenStable();

			const compiled = fixture.nativeElement as HTMLElement;
			expect(compiled.textContent).toContain('No statistics yet');
		});

		it('should handle error when fetching stats fails', async () => {
			fixture.detectChanges();
			TestBed.tick();

			const req = httpMock.expectOne(`${apiUrl}/games/stats`);
			req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

			await appRef.whenStable();

			expect(component.statsResource.error()).toBeTruthy();
		});
	});
});
