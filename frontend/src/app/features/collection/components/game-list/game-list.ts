import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesService } from '../../services/games';
import { Game } from '../../models/game.model';

@Component({
	selector: 'app-game-list',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './game-list.html',
})
export class GameList implements OnInit {
	readonly #gamesService = inject(GamesService);

	readonly games = signal<Game[]>([]);
	readonly loading = signal(false);

	ngOnInit(): void {
		this.#loadGames();
	}

	#loadGames(): void {
		this.loading.set(true);
		this.#gamesService.getAllGames().subscribe((games: Game[]) => {
			this.games.set(games);
			this.loading.set(false);
		});
	}
}
