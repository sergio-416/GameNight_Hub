export interface Game {
  id: string;
  name: string;
  bggId?: number;
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
  createdAt?: Date;
  updatedAt?: Date;
}
