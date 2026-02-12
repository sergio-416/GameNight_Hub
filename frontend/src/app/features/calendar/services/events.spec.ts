import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { EventsService } from './events';
import { API_CONFIG } from '@core/config/api.config';
import { Event } from '../models/event.model';
import { beforeEach, afterEach, expect, describe, it } from 'vitest';

describe('EventsService', () => {
	let service: EventsService;
	let httpMock: HttpTestingController;

	const apiUrl = API_CONFIG.baseUrl;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [EventsService, provideHttpClient(), provideHttpClientTesting()],
		});
		service = TestBed.inject(EventsService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	describe('fetch events', () => {
		it('should return all events when getAllEvents is called', () => {
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
				{
					_id: '2',
					title: 'Catan Tournament',
					gameId: '507f1f77bcf86cd799439013',
					locationId: '507f1f77bcf86cd799439014',
					startTime: new Date('2026-02-15T14:00:00'),
					maxPlayers: 4,
				},
			];

			service.getAllEvents().subscribe((events: Event[]) => {
				expect(events).toEqual(mockEvents);
				expect(events.length).toBe(2);
			});

			const req = httpMock.expectOne(`${apiUrl}/events`);
			expect(req.request.method).toBe('GET');
			req.flush(mockEvents);
		});

		it('should return empty array when no events exist', () => {
			service.getAllEvents().subscribe((events: Event[]) => {
				expect(events).toEqual([]);
				expect(events.length).toBe(0);
			});

			const req = httpMock.expectOne(`${apiUrl}/events`);
			req.flush([]);
		});
	});

	describe('get single event', () => {
		it('should return a single event when getEventById is called with valid id', () => {
			const eventId = '507f1f77bcf86cd799439011';
			const mockEvent: Event = {
				_id: eventId,
				title: 'Game Night Friday',
				gameId: '507f1f77bcf86cd799439011',
				locationId: '507f1f77bcf86cd799439012',
				startTime: new Date('2026-02-10T19:00:00'),
				endTime: new Date('2026-02-10T23:00:00'),
				maxPlayers: 6,
				description: 'Weekly board game night',
				color: '#ff0000',
			};

			service.getEventById(eventId).subscribe((event: Event) => {
				expect(event).toEqual(mockEvent);
				expect(event._id).toBe(eventId);
			});

			const req = httpMock.expectOne(`${apiUrl}/events/${eventId}`);
			expect(req.request.method).toBe('GET');
			req.flush(mockEvent);
		});
	});

	describe('create event', () => {
		it('should create new event when valid data provided', () => {
			const newEvent = {
				title: 'New Game Night',
				gameId: '507f1f77bcf86cd799439011',
				locationId: '507f1f77bcf86cd799439012',
				startTime: new Date('2026-02-20T19:00:00'),
				endTime: new Date('2026-02-20T23:00:00'),
				maxPlayers: 6,
				description: 'A new game night',
				color: '#00ff00',
			};

			const createdEvent: Event = {
				_id: '507f1f77bcf86cd799439015',
				...newEvent,
			};

			service.createEvent(newEvent).subscribe((event: Event) => {
				expect(event).toEqual(createdEvent);
				expect(event._id).toBeDefined();
			});

			const req = httpMock.expectOne(`${apiUrl}/events`);
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toEqual(newEvent);
			req.flush(createdEvent);
		});
	});

	describe('update event', () => {
		it('should update event fields when valid data provided', () => {
			const eventId = '507f1f77bcf86cd799439011';
			const updateData = { title: 'Updated Game Night', maxPlayers: 8 };

			const updatedEvent: Event = {
				_id: eventId,
				title: 'Updated Game Night',
				gameId: '507f1f77bcf86cd799439011',
				locationId: '507f1f77bcf86cd799439012',
				startTime: new Date('2026-02-10T19:00:00'),
				maxPlayers: 8,
			};

			service.updateEvent(eventId, updateData).subscribe((event: Event) => {
				expect(event.title).toBe('Updated Game Night');
				expect(event.maxPlayers).toBe(8);
			});

			const req = httpMock.expectOne(`${apiUrl}/events/${eventId}`);
			expect(req.request.method).toBe('PATCH');
			expect(req.request.body).toEqual(updateData);
			req.flush(updatedEvent);
		});
	});

	describe('delete event', () => {
		it('should remove event when valid id provided', () => {
			const eventId = '507f1f77bcf86cd799439011';
			const deletedEvent: Event = {
				_id: eventId,
				title: 'Deleted Game Night',
				gameId: '507f1f77bcf86cd799439011',
				locationId: '507f1f77bcf86cd799439012',
				startTime: new Date('2026-02-10T19:00:00'),
			};

			service.deleteEvent(eventId).subscribe((event: Event) => {
				expect(event._id).toBe(eventId);
			});

			const req = httpMock.expectOne(`${apiUrl}/events/${eventId}`);
			expect(req.request.method).toBe('DELETE');
			req.flush(deletedEvent);
		});
	});
});
