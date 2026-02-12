import { Component, signal } from '@angular/core';
import { Header } from './shared/components/header/header';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Header],
	templateUrl: './app.html',
	styleUrl: './app.css',
})
export class App {
	protected readonly title = signal('gamenight_hub');
}
