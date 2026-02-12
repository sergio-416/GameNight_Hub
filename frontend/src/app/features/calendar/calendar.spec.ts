import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, afterEach, expect, vi, describe, it } from 'vitest';
import { Calendar } from './calendar';
import { EventsService } from './services/events';
import { Event } from './models/event.model';

describe('Calendar', () => {
	let component: Calendar;
	let fixture: ComponentFixture<Calendar>;

	const mockEventsService = {
		getAllEvents: vi.fn(),
		updateEvent: vi.fn(),
		deleteEvent: vi.fn(),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Calendar],
			providers: [{ provide: EventsService, useValue: mockEventsService }],
		}).compileComponents();

		fixture = TestBed.createComponent(Calendar);
		component = fixture.componentInstance;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('display events', () => {
		it('should display FullCalendar when component loads', () => {
			mockEventsService.getAllEvents.mockReturnValue(of([]));
			fixture.detectChanges();

			const compiled = fixture.nativeElement as HTMLElement;
			expect(compiled.querySelector('[data-testid="calendar-container"]')).toBeTruthy();
		});

		it('should display events when events exist', () => {
			const mockEvents: Event[] = [
				{
					_id: '1',
					title: 'Game Night Friday',
					gameId: '507f1f77bcf86cd799439011',
					locationId: '507f1f77bcf86cd799439012',
					startTime: new Date('2026-02-10T19:00:00'),
					endTime: new Date('2026-02-10T23:00:00'),
					maxPlayers: 6,
					description: 'Weekly board game night',
					color: '#ff0000',
				},
			];

			mockEventsService.getAllEvents.mockReturnValue(of(mockEvents));
			fixture.detectChanges();

			expect(component.events()).toEqual(mockEvents);
		});

		it('should display empty state when no events exist', () => {
			mockEventsService.getAllEvents.mockReturnValue(of([]));
			fixture.detectChanges();

			const compiled = fixture.nativeElement as HTMLElement;
			expect(compiled.textContent).toContain('No events yet');
		});

		it('should handle loading state while fetching events', () => {
			mockEventsService.getAllEvents.mockReturnValue(of([]));
			fixture.detectChanges();

			expect(component.loading()).toBe(false);
		});

		it('should call EventsService to fetch events on init', () => {
			mockEventsService.getAllEvents.mockReturnValue(of([]));
			fixture.detectChanges();

			expect(mockEventsService.getAllEvents).toHaveBeenCalled();
		});
	});

	describe('event modal interactions', () => {
		const createMockEvent = (id: string, title: string): Event => ({
			_id: id,
			title,
			gameId: '507f1f77bcf86cd799439011',
			locationId: '507f1f77bcf86cd799439012',
			startTime: new Date('2026-02-10T19:00:00'),
			endTime: new Date('2026-02-10T23:00:00'),
			maxPlayers: 6,
			description: 'Test description',
			color: '#ff0000',
		});

		it('should open modal with selected event when calendar event is clicked', () => {
			const mockEvents: Event[] = [createMockEvent('1', 'Game Night')];
			mockEventsService.getAllEvents.mockReturnValue(of(mockEvents));
			fixture.detectChanges();

			component.handleEventClick({ event: { id: '1', title: 'Game Night' } });

			expect(component.modalOpen()).toBe(true);
			expect(component.selectedEvent()?._id).toBe('1');
			expect(component.selectedEvent()?.title).toBe('Game Night');
		});

		it('should close modal and refresh events when event is saved', () => {
			const mockEvents: Event[] = [createMockEvent('1', 'Game Night')];
			const updatedEvent: Event = { ...createMockEvent('1', 'Updated Game Night'), maxPlayers: 8 };

			mockEventsService.getAllEvents.mockReturnValue(of(mockEvents));
			mockEventsService.updateEvent.mockReturnValue(of(updatedEvent));
			fixture.detectChanges();

			component.handleEventClick({ event: { id: '1', title: 'Game Night' } });
			expect(component.modalOpen()).toBe(true);

			component.onModalSaved(updatedEvent);

			expect(component.modalOpen()).toBe(false);
			expect(mockEventsService.getAllEvents).toHaveBeenCalledTimes(2);
		});

		it('should remove event from list and close modal when event is deleted', () => {
			const mockEvents: Event[] = [
				createMockEvent('1', 'Game Night'),
				createMockEvent('2', 'Catan Night'),
			];

			mockEventsService.getAllEvents.mockReturnValue(of(mockEvents));
			mockEventsService.deleteEvent.mockReturnValue(of({}));
			fixture.detectChanges();

			component.handleEventClick({ event: { id: '1', title: 'Game Night' } });
			expect(component.events().length).toBe(2);

			component.onModalDeleted('1');

			expect(component.modalOpen()).toBe(false);
			expect(component.events().length).toBe(1);
			expect(component.events()[0]._id).toBe('2');
		});
	});
});
