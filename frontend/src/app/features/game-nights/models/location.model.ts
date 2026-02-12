export interface Location {
	_id: string;
	name: string;
	latitude: number;
	longitude: number;
	address?: string;
	venueType?: 'cafe' | 'store' | 'home' | 'public_space' | 'other';
	capacity?: number;
	amenities?: string[];
	description?: string;
	hostName?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
