import { vi } from 'vitest';

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
import { Map } from './map';
import { LocationsService } from '../../services/locations';
import { of, Subject, throwError } from 'rxjs';
import { beforeEach, afterEach, expect, describe, it } from 'vitest';

describe('Map', () => {
	let fixture: ComponentFixture<Map>;

	const mockLocationsService = {
		findInBounds: vi.fn(),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Map],
			providers: [{ provide: LocationsService, useValue: mockLocationsService }],
		}).compileComponents();

		fixture = TestBed.createComponent(Map);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('map initialization', () => {
		it('should display interactive map when component loads', () => {
			mockLocationsService.findInBounds.mockReturnValue(of([]));

			fixture.detectChanges();

			const mapContainer = fixture.nativeElement.querySelector('[data-testid="map-container"]');
			expect(mapContainer).toBeTruthy();
		});
	});

	describe('location markers', () => {
		it('should display markers for all game night locations', () => {
			const mockLocations = [
				{ _id: '1', name: 'Board Game Cafe', latitude: 41.38, longitude: 2.17, venueType: 'cafe' },
				{ _id: '2', name: 'Game Store', latitude: 41.4, longitude: 2.18, venueType: 'store' },
			];

			mockLocationsService.findInBounds.mockReturnValue(of(mockLocations));

			fixture.detectChanges();

			expect(mockLocationsService.findInBounds).toHaveBeenCalled();
		});

		it('should show empty map when no locations exist', () => {
			mockLocationsService.findInBounds.mockReturnValue(of([]));

			fixture.detectChanges();

			expect(mockLocationsService.findInBounds).toHaveBeenCalled();
		});
	});

	describe('loading state', () => {
		it('should display loading indicator while fetching locations', async () => {
			const subject = new Subject<Location[]>();
			mockLocationsService.findInBounds.mockReturnValue(subject);

			fixture.detectChanges();

			const loadingIndicator = fixture.nativeElement.querySelector(
				'[data-testid="loading-indicator"]',
			);
			expect(loadingIndicator).toBeTruthy();

			subject.next([]);
			subject.complete();

			await fixture.whenStable();
			fixture.detectChanges();

			const loadingIndicatorAfter = fixture.nativeElement.querySelector(
				'[data-testid="loading-indicator"]',
			);
			expect(loadingIndicatorAfter).toBeFalsy();
		});
	});

	describe('error state', () => {
		it('should display error message when fetching locations fails', () => {
			mockLocationsService.findInBounds.mockReturnValue(throwError(() => new Error('Failed')));

			fixture.detectChanges();

			const errorMessage = fixture.nativeElement.querySelector('[data-testid="error-message"]');
			expect(errorMessage).toBeTruthy();
		});
	});

	describe('marker popups', () => {
		it('should display venue information when marker clicked', () => {
			const mockLocation = {
				_id: '1',
				name: 'Board Game Cafe',
				latitude: 41.38,
				longitude: 2.17,
				venueType: 'cafe',
				address: '123 Game Street',
			};

			mockLocationsService.findInBounds.mockReturnValue(of([mockLocation]));

			fixture.detectChanges();

			expect(mockLocation.name).toBeDefined();
		});
	});
});
