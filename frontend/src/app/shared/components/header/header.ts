import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth';

@Component({
	selector: 'app-header',
	imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
	templateUrl: './header.html',
	styleUrl: './header.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
	readonly #authService = inject(AuthService);
	readonly #mobileMenuOpen = signal(false);
	readonly #notificationCount = signal(0);

	readonly isLoggedIn = this.#authService.isLoggedIn;
	readonly userAvatar = computed(() => this.#authService.currentUser()?.photoURL ?? null);
	readonly notificationCount = this.#notificationCount.asReadonly();
	readonly isMobileMenuOpen = this.#mobileMenuOpen.asReadonly();

	toggleMobileMenu(): void {
		this.#mobileMenuOpen.update((open) => !open);
	}

	closeMobileMenu(): void {
		this.#mobileMenuOpen.set(false);
	}

	async login(): Promise<void> {
		await this.#authService.login();
	}

	async logout(): Promise<void> {
		await this.#authService.logout();
	}
}
