import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, afterEach, expect, vi, describe, it } from 'vitest';
import { EventModal } from './event-modal';
import { EventsService } from '@features/calendar/services/events';
import type { Event } from '@features/calendar/models/event.model';

describe('EventModal', () => {
	let component: EventModal;
	let fixture: ComponentFixture<EventModal>;

	const mockEventsService = {
		updateEvent: vi.fn(),
		deleteEvent: vi.fn(),
	};

	const mockEvent: Event = {
		_id: '1',
		title: 'Game Night Friday',
		gameId: '507f1f77bcf86cd799439011',
		locationId: '507f1f77bcf86cd799439012',
		startTime: new Date('2026-02-10T19:00:00'),
		endTime: new Date('2026-02-10T23:00:00'),
		maxPlayers: 6,
		description: 'Weekly board game night',
		color: '#ff0000',
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EventModal],
			providers: [{ provide: EventsService, useValue: mockEventsService }],
		}).compileComponents();

		fixture = TestBed.createComponent(EventModal);
		component = fixture.componentInstance;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('modal visibility', () => {
		it('should display modal when isOpen is true', () => {
			fixture.componentRef.setInput('isOpen', true);
			fixture.detectChanges();

			const compiled = fixture.nativeElement as HTMLElement;
			expect(compiled.querySelector('[data-testid="event-modal"]')).toBeTruthy();
		});

		it('should hide modal when isOpen is false', () => {
			fixture.componentRef.setInput('isOpen', false);
			fixture.detectChanges();

			const compiled = fixture.nativeElement as HTMLElement;
			expect(compiled.querySelector('[data-testid="event-modal"]')).toBeFalsy();
		});

		it('should emit close event when backdrop is clicked', () => {
			let closed = false;
			component.closed.subscribe(() => {
				closed = true;
			});

			fixture.componentRef.setInput('isOpen', true);
			fixture.detectChanges();

			const backdrop = fixture.nativeElement.querySelector('[data-testid="modal-backdrop"]');
			backdrop?.click();

			expect(closed).toBe(true);
		});

		it('should emit close event when close button is clicked', () => {
			let closed = false;
			component.closed.subscribe(() => {
				closed = true;
			});

			fixture.componentRef.setInput('isOpen', true);
			fixture.detectChanges();

			const closeButton = fixture.nativeElement.querySelector('[data-testid="close-button"]');
			closeButton?.click();

			expect(closed).toBe(true);
		});
	});

	describe('event editing', () => {
		beforeEach(() => {
			fixture.componentRef.setInput('event', mockEvent);
			fixture.componentRef.setInput('isOpen', true);
			fixture.detectChanges();
		});

		it('should display event title in input field', () => {
			const titleInput = fixture.nativeElement.querySelector('[data-testid="title-input"]');
			expect(titleInput?.value).toBe('Game Night Friday');
		});

		it('should display event description in textarea', () => {
			const descInput = fixture.nativeElement.querySelector('[data-testid="description-input"]');
			expect(descInput?.value).toBe('Weekly board game night');
		});

		it('should display max players in number input', () => {
			const maxPlayersInput = fixture.nativeElement.querySelector(
				'[data-testid="max-players-input"]',
			);
			expect(maxPlayersInput?.value).toBe('6');
		});

		it('should update form values when user types', () => {
			const titleInput = fixture.nativeElement.querySelector('[data-testid="title-input"]');
			titleInput.value = 'Updated Title';
			titleInput.dispatchEvent(new Event('input'));

			expect(component.formData().title).toBe('Updated Title');
		});
	});

	describe('saving event', () => {
		beforeEach(() => {
			fixture.componentRef.setInput('event', mockEvent);
			fixture.componentRef.setInput('isOpen', true);
			fixture.detectChanges();
		});

		it('should call EventsService.updateEvent when save button is clicked', () => {
			mockEventsService.updateEvent.mockReturnValue(of(mockEvent));

			const saveButton = fixture.nativeElement.querySelector('[data-testid="save-button"]');
			saveButton?.click();

			expect(mockEventsService.updateEvent).toHaveBeenCalledWith('1', expect.any(Object));
		});

		it('should emit save event after successful update', () => {
			mockEventsService.updateEvent.mockReturnValue(of(mockEvent));
			let saved = false;
			component.saved.subscribe(() => {
				saved = true;
			});

			const saveButton = fixture.nativeElement.querySelector('[data-testid="save-button"]');
			saveButton?.click();

			expect(saved).toBe(true);
		});

		it('should disable save button when title is empty', () => {
			const titleInput = fixture.nativeElement.querySelector('[data-testid="title-input"]');
			titleInput.value = '';
			titleInput.dispatchEvent(new Event('input'));
			fixture.detectChanges();

			const saveButton = fixture.nativeElement.querySelector('[data-testid="save-button"]');
			expect(saveButton?.disabled).toBe(true);
		});
	});

	describe('deleting event', () => {
		beforeEach(() => {
			fixture.componentRef.setInput('event', mockEvent);
			fixture.componentRef.setInput('isOpen', true);
			fixture.detectChanges();
		});

		it('should call EventsService.deleteEvent when delete button is clicked', () => {
			mockEventsService.deleteEvent.mockReturnValue(of(mockEvent));

			const deleteButton = fixture.nativeElement.querySelector('[data-testid="delete-button"]');
			deleteButton?.click();

			expect(mockEventsService.deleteEvent).toHaveBeenCalledWith('1');
		});

		it('should emit delete event after successful deletion', () => {
			mockEventsService.deleteEvent.mockReturnValue(of(mockEvent));
			let deleted = false;
			component.deleted.subscribe(() => {
				deleted = true;
			});

			const deleteButton = fixture.nativeElement.querySelector('[data-testid="delete-button"]');
			deleteButton?.click();

			expect(deleted).toBe(true);
		});
	});
});
