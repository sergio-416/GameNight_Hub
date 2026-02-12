import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '@core/config/api.config';
import { Event } from '../models/event.model';

const API_URL = API_CONFIG.baseUrl;

@Injectable({
	providedIn: 'root',
})
export class EventsService {
	readonly #http = inject(HttpClient);

	getAllEvents(): Observable<Event[]> {
		return this.#http.get<Event[]>(`${API_URL}/events`);
	}

	getEventById(id: string): Observable<Event> {
		return this.#http.get<Event>(`${API_URL}/events/${id}`);
	}

	createEvent(event: Omit<Event, '_id'>): Observable<Event> {
		return this.#http.post<Event>(`${API_URL}/events`, event);
	}

	updateEvent(id: string, event: Partial<Event>): Observable<Event> {
		return this.#http.patch<Event>(`${API_URL}/events/${id}`, event);
	}

	deleteEvent(id: string): Observable<Event> {
		return this.#http.delete<Event>(`${API_URL}/events/${id}`);
	}
}
