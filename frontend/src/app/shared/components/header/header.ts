import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'app-header',
	imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
	templateUrl: './header.html',
	styleUrl: './header.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
	readonly #mobileMenuOpen = signal(false);
	readonly #isLoggedIn = signal(false);
	readonly #userAvatar = signal<string | null>(null);
	readonly #notificationCount = signal(0);

	readonly isMobileMenuOpen = this.#mobileMenuOpen.asReadonly();
	readonly isLoggedIn = this.#isLoggedIn.asReadonly();
	readonly userAvatar = this.#userAvatar.asReadonly();
	readonly notificationCount = this.#notificationCount.asReadonly();

	toggleMobileMenu(): void {
		this.#mobileMenuOpen.update((open) => !open);
	}

	closeMobileMenu(): void {
		this.#mobileMenuOpen.set(false);
	}
}
