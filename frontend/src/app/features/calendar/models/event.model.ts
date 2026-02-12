export interface Event {
	_id: string;
	title: string;
	gameId: string;
	locationId: string;
	startTime: Date;
	endTime?: Date;
	maxPlayers?: number;
	description?: string;
	color?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
