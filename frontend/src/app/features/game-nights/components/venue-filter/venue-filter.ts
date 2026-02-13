import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-venue-filter',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './venue-filter.html',
})
export class VenueFilter {
	readonly filterChange = output<string[]>();

	readonly #venueTypes = [
		{ value: 'cafe', label: 'Café' },
		{ value: 'store', label: 'Store' },
		{ value: 'home', label: 'Home' },
		{ value: 'public_space', label: 'Public Space' },
		{ value: 'other', label: 'Other' },
	] as const;

	readonly venueTypes = this.#venueTypes;

	readonly #selectedTypes = new Set<string>();

	toggleType(type: string): void {
		if (this.#selectedTypes.has(type)) {
			this.#selectedTypes.delete(type);
		} else {
			this.#selectedTypes.add(type);
		}
		this.filterChange.emit([...this.#selectedTypes]);
	}

	isSelected(type: string): boolean {
		return this.#selectedTypes.has(type);
	}
}
