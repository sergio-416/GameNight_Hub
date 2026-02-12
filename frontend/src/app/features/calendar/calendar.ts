import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventsService } from './services/events';
import { Event } from './models/event.model';
import { EventModal } from './components/event-modal/event-modal';

@Component({
	selector: 'app-calendar',
	standalone: true,
	imports: [CommonModule, FullCalendarModule, EventModal],
	templateUrl: './calendar.html',
	styleUrl: './calendar.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendar implements OnInit {
	readonly #eventsService = inject(EventsService);

	readonly #events = signal<Event[]>([]);
	readonly #loading = signal<boolean>(false);
	readonly #error = signal<string | null>(null);

	readonly #selectedEvent = signal<Event | undefined>(undefined);
	readonly #modalOpen = signal(false);

	readonly selectedEvent = this.#selectedEvent.asReadonly();
	readonly modalOpen = this.#modalOpen.asReadonly();

	readonly events = this.#events.asReadonly();
	readonly loading = this.#loading.asReadonly();
	readonly error = this.#error.asReadonly();

	calendarOptions: CalendarOptions = {
		plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
		initialView: 'dayGridMonth',
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay',
		},
		events: [],
		eventClick: this.handleEventClick.bind(this),
	};

	ngOnInit(): void {
		this.#loadEvents();
	}

	#loadEvents(): void {
		this.#loading.set(true);
		this.#error.set(null);

		this.#eventsService.getAllEvents().subscribe({
			next: (events) => {
				this.#events.set(events);
				this.#loading.set(false);
				this.updateCalendarEvents();
			},
			error: (error) => {
				this.#error.set('Failed to load events');
				this.#loading.set(false);
				console.error('Error loading events:', error);
			},
		});
	}

	private updateCalendarEvents(): void {
		const calendarEvents: EventInput[] = this.#events().map((event) => ({
			id: event._id,
			title: event.title,
			start: event.startTime,
			end: event.endTime,
			color: event.color,
			extendedProps: {
				description: event.description,
				maxPlayers: event.maxPlayers,
				locationId: event.locationId,
				gameId: event.gameId,
			},
		}));

		this.calendarOptions = {
			...this.calendarOptions,
			events: calendarEvents,
		};
	}

	handleEventClick(info: { event: { id: string; title: string } }): void {
		const eventId = info.event.id;
		const foundEvent = this.#events().find((e) => e._id === eventId);

		if (foundEvent) {
			this.#selectedEvent.set(foundEvent);
			this.#modalOpen.set(true);
		} else {
			this.#selectedEvent.set(undefined);
		}
	}

	onModalSaved(_updatedEvent: Event): void {
		this.#modalOpen.set(false);
		this.#loadEvents();
	}

	onModalDeleted(eventId: string): void {
		this.#modalOpen.set(false);
		this.#events.update((events) => events.filter((e) => e._id !== eventId));
		this.updateCalendarEvents();
	}

	closeModal(): void {
		this.#modalOpen.set(false);
	}
}
