import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Collection } from './features/collection/collection';
import { GameNights } from './features/game-nights/game-nights';
import { Calendar } from './features/calendar/calendar';
import { Stats } from './features/stats/stats';

export const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'home', component: Home },
	{ path: 'collection', component: Collection },
	{ path: 'game-nights', component: GameNights },
	{ path: 'calendar', component: Calendar },
	{ path: 'stats', component: Stats },
];
