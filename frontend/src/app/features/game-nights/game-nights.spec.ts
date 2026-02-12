import { vi } from 'vitest';
import { of } from 'rxjs';
import { LocationsService } from './services/locations';

vi.mock('maplibre-gl', () => ({
	default: {
		Map: class MockMap {
			addControl = vi.fn();
			fitBounds = vi.fn();
			on = vi.fn();
			remove = vi.fn();
			getBounds = vi.fn().mockReturnValue({
				getSouthWest: () => ({ lat: 41.3, lng: 2.1 }),
				getNorthEast: () => ({ lat: 41.5, lng: 2.2 }),
			});
		},
		Marker: class MockMarker {
			setLngLat = vi.fn().mockReturnThis();
			setPopup = vi.fn().mockReturnThis();
			addTo = vi.fn().mockReturnThis();
		},
		Popup: class MockPopup {
			setHTML = vi.fn().mockReturnThis();
		},
		NavigationControl: class MockNavigationControl {},
		LngLatBounds: class MockLngLatBounds {
			extend = vi.fn();
		},
	},
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameNights } from './game-nights';
import { beforeEach, expect, describe, it } from 'vitest';

describe('GameNights', () => {
	let fixture: ComponentFixture<GameNights>;

	const mockLocationsService = {
		findInBounds: vi.fn().mockReturnValue(of([])),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GameNights],
			providers: [{ provide: LocationsService, useValue: mockLocationsService }],
		}).compileComponents();

		fixture = TestBed.createComponent(GameNights);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('page display', () => {
		it('should display page title when component loads', () => {
			fixture.detectChanges();

			const title = fixture.nativeElement.querySelector('h1');
			expect(title).toBeTruthy();
			expect(title.textContent).toContain('Game Night Locations');
		});

		it('should display description text', () => {
			fixture.detectChanges();

			const description = fixture.nativeElement.querySelector('p');
			expect(description).toBeTruthy();
			expect(description.textContent).toContain('board game');
		});
	});

	describe('map component', () => {
		it('should render map component when page loads', () => {
			fixture.detectChanges();

			const mapComponent = fixture.nativeElement.querySelector('app-map');
			expect(mapComponent).toBeTruthy();
		});

		it('should fetch locations when component initializes', () => {
			fixture.detectChanges();

			const mapComponent = fixture.nativeElement.querySelector('app-map');
			expect(mapComponent).toBeTruthy();
		});
	});
});
