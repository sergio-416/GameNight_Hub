import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameList } from './components/game-list/game-list';

@Component({
	selector: 'app-collection',
	imports: [GameList],
	templateUrl: './collection.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Collection {}
