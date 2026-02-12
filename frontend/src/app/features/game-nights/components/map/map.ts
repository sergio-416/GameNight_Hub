import {
	Component,
	ElementRef,
	AfterViewInit,
	viewChild,
	inject,
	signal,
	OnDestroy,
	input,
	effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import maplibregl from 'maplibre-gl';
import { LocationsService } from '../../services/locations';
import { Location } from '../../models/location.model';

@Component({
	selector: 'app-map',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './map.html',
	styleUrls: ['./map.css'],
})
export class Map implements AfterViewInit, OnDestroy {
	readonly venueTypes = input<string[]>([]);

	readonly #locations = signal<Location[]>([]);
	readonly #loading = signal(false);
	readonly #error = signal<string | null>(null);

	readonly loading = this.#loading.asReadonly();
	readonly error = this.#error.asReadonly();

	readonly mapContainer = viewChild.required<ElementRef>('mapContainer');

	readonly #locationsService = inject(LocationsService);
	readonly #markerColors: Record<string, string> = {
		cafe: '#8B4513',
		store: '#1E90FF',
		home: '#228B22',
		public_space: '#FF6347',
		other: '#808080',
	};
	#map?: maplibregl.Map;
	#markers: maplibregl.Marker[] = [];

	// eslint-disable-next-line no-unused-private-class-members
	readonly #reloadEffect = effect(() => {
		this.venueTypes();

		if (this.#map) {
			this.#loadLocationsInBounds();
		}
	});

	ngAfterViewInit(): void {
		this.#initializeMap();
		this.#map!.on('moveend', () => this.#loadLocationsInBounds());
		this.#loadLocationsInBounds();
	}

	ngOnDestroy(): void {
		this.#map?.remove();
	}

	#initializeMap(): void {
		const container = this.mapContainer().nativeElement;

		this.#map = new maplibregl.Map({
			container,
			style: 'https://demotiles.maplibre.org/style.json',
			center: [2.17, 41.38],
			zoom: 12,
		});

		this.#map.addControl(new maplibregl.NavigationControl());
	}

	#loadLocationsInBounds(): void {
		if (!this.#map) return;

		const bounds = this.#map.getBounds();
		const sw = bounds.getSouthWest();
		const ne = bounds.getNorthEast();
		const types = this.venueTypes();

		this.#loading.set(true);
		this.#error.set(null);

		this.#locationsService.findInBounds(sw.lat, sw.lng, ne.lat, ne.lng, types).subscribe({
			next: (locations) => {
				this.#locations.set(locations);
				this.#addMarkers(locations);
				this.#loading.set(false);
			},
			error: (err) => {
				this.#error.set('Failed to load locations');
				this.#loading.set(false);
				console.error(err);
			},
		});
	}

	#addMarkers(locations: Location[]): void {
		if (!this.#map) return;

		this.#clearMarkers();

		locations.forEach((location) => {
			const color = this.#markerColors[location.venueType || 'other'];

			const el = document.createElement('div');
			el.className = 'custom-marker';
			el.style.backgroundColor = color;
			el.style.width = '24px';
			el.style.height = '24px';
			el.style.borderRadius = '50%';
			el.style.border = '2px solid white';
			el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

			const marker = new maplibregl.Marker({ element: el })
				.setLngLat([location.longitude, location.latitude])
				.setPopup(
					new maplibregl.Popup().setHTML(`
          <h3>${location.name}</h3>
          <p>${location.venueType || 'Venue'}</p>
          ${location.address ? `<p>${location.address}</p>` : ''}
        `),
				)
				.addTo(this.#map!);

			this.#markers.push(marker);
		});
	}

	#clearMarkers(): void {
		this.#markers.forEach((marker) => marker.remove());
		this.#markers = [];
	}
}
