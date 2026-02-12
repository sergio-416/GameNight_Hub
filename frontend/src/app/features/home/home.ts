import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDiceD20, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';

@Component({
	selector: 'app-home',
	imports: [RouterLink, FontAwesomeModule],
	templateUrl: './home.html',
	styleUrl: './home.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
	readonly diceIcon = faDiceD20;
	readonly calendarIcon = faCalendarDays;
	readonly mapPinIcon = faMapMarkerAlt;
}
