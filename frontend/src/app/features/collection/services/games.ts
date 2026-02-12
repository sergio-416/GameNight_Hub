import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '@core/config/api.config';
import { Game, BggSearchResult, PersonalFields, BggCsvSearchResult } from '../models/game.model';

const API_URL = API_CONFIG.baseUrl;

@Injectable({
	providedIn: 'root',
})
export class GamesService {
	readonly #http = inject(HttpClient);

	searchLocal(query: string): Observable<BggCsvSearchResult[]> {
		return this.#http.get<BggCsvSearchResult[]>(
			`${API_URL}${API_CONFIG.endpoints.search}?query=${query}`,
		);
	}

	searchBgg(query: string): Observable<BggSearchResult[]> {
		return this.#http.get<BggSearchResult[]>(
			`${API_URL}${API_CONFIG.endpoints.bggSearch}?query=${query}`,
		);
	}

	getAllGames(): Observable<Game[]> {
		return this.#http.get<Game[]>(`${API_URL}${API_CONFIG.endpoints.games}`);
	}

	importGame(bggId: number, personalFields: PersonalFields): Observable<Game> {
		return this.#http.post<Game>(
			`${API_URL}${API_CONFIG.endpoints.importGame}/${bggId}`,
			personalFields,
		);
	}

	getStats(): Observable<{
		gamesByCategory: { name: string; value: number }[];
		complexityDistribution: { name: string; value: number }[];
		collectionGrowth: { x: string; y: number }[];
		totalGames: number;
	}> {
		return this.#http.get<{
			gamesByCategory: { name: string; value: number }[];
			complexityDistribution: { name: string; value: number }[];
			collectionGrowth: { x: string; y: number }[];
			totalGames: number;
		}>(`${API_URL}/games/stats`);
	}
}
