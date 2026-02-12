export interface Game {
	_id: string;
	bggId: number;
	name: string;
	yearPublished?: number;
	minPlayers?: number;
	maxPlayers?: number;
	playingTime?: number;
	minAge?: number;
	description?: string;
	categories?: string[];
	mechanics?: string[];
	publisher?: string;
	owned: boolean;
	notes?: string;
	complexity?: number;
}

export interface BggSearchResult {
	bggId: number;
	name: string;
	yearPublished?: number;
}

export interface PersonalFields {
	owned?: boolean;
	notes?: string;
	complexity?: number;
}

export interface BggCsvSearchResult {
	id: string;
	name: string;
	yearpublished: string;
	rank: string;
	average: string;
	bayesaverage: string;
}
