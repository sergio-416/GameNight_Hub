import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Map } from './components/map/map';
import { VenueFilter } from './components/venue-filter/venue-filter';

@Component({
	selector: 'app-game-nights',
	imports: [Map, VenueFilter],
	templateUrl: './game-nights.html',
	styleUrl: './game-nights.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameNights {
	readonly #selectedVenueTypes = signal<string[]>([]);

	readonly selectedVenueTypes = this.#selectedVenueTypes.asReadonly();

	onFilterChange(types: string[]): void {
		this.#selectedVenueTypes.set(types);
	}
}
