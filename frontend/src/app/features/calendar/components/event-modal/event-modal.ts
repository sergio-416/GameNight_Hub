import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	input,
	output,
	signal,
	untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsService } from '@features/calendar/services/events';
import type { Event } from '@features/calendar/models/event.model';

@Component({
	selector: 'app-event-modal',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './event-modal.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventModal {
	readonly #eventsService = inject(EventsService);

	readonly isOpen = input.required<boolean>();
	readonly event = input<Event | undefined>(undefined);

	readonly closed = output<void>();
	readonly saved = output<Event>();
	readonly deleted = output<string>();

	readonly #formData = signal<Partial<Event>>({});
	readonly #saving = signal(false);
	readonly #deleting = signal(false);

	readonly formData = this.#formData.asReadonly();
	readonly saving = this.#saving.asReadonly();
	readonly deleting = this.#deleting.asReadonly();
	readonly isValid = computed(() => {
		const data = this.#formData();
		return !!data.title && data.title.trim().length > 0;
	});

	constructor() {
		effect(() => {
			const evt = this.event();
			if (evt) {
				untracked(() => {
					this.#formData.set({
						title: evt.title,
						description: evt.description,
						maxPlayers: evt.maxPlayers,
						startTime: evt.startTime,
						endTime: evt.endTime,
						locationId: evt.locationId,
						gameId: evt.gameId,
						color: evt.color,
					});
				});
			}
		});
	}

	handleBackdropClick(event: MouseEvent): void {
		if (event.target === event.currentTarget) {
			this.closeModal();
		}
	}

	closeModal(): void {
		this.closed.emit();
	}

	updateField<K extends keyof Event>(field: K, value: Event[K]): void {
		this.#formData.update((data) => ({ ...data, [field]: value }));
	}

	handleSave(): void {
		if (!this.isValid()) return;

		const evt = this.event();
		if (!evt) return;

		const eventId = evt._id;
		this.#saving.set(true);

		this.#eventsService.updateEvent(eventId, this.#formData()).subscribe({
			next: (updatedEvent) => {
				this.#saving.set(false);
				this.saved.emit(updatedEvent);
			},
			error: () => {
				this.#saving.set(false);
			},
		});
	}

	handleDelete(): void {
		const evt = this.event();
		if (!evt) return;

		const eventId = evt._id;
		this.#deleting.set(true);

		this.#eventsService.deleteEvent(eventId).subscribe({
			next: () => {
				this.#deleting.set(false);
				this.deleted.emit(eventId);
			},
			error: () => {
				this.#deleting.set(false);
			},
		});
	}
}
