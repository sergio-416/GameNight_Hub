export const API_CONFIG = {
	baseUrl: 'http://localhost:3000',
	endpoints: {
		search: '/games/search',
		bggSearch: '/games/bgg/search',
		bggGame: '/games/bgg/game',
		games: '/games',
		importGame: '/games/import',
		locations: '/locations',
		locationsBounds: '/locations/bounds',
	},
} as const;

export type ApiConfig = typeof API_CONFIG;
