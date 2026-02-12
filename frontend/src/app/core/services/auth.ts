import { Injectable, signal, computed, inject } from '@angular/core';
import {
	Auth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
	User,
} from '@angular/fire/auth';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	readonly #auth = inject(Auth);
	readonly #currentUser = signal<User | null>(null);
	readonly #authStateUnsubscribe: () => void;

	readonly currentUser = this.#currentUser.asReadonly();
	readonly isLoggedIn = computed(() => this.#currentUser() !== null);

	constructor() {
		this.#authStateUnsubscribe = onAuthStateChanged(this.#auth, (user) => {
			this.#currentUser.set(user);
		});
	}

	async login(): Promise<void> {
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(this.#auth, provider);
		this.#currentUser.set(result.user);
	}

	async logout(): Promise<void> {
		await signOut(this.#auth);
		this.#currentUser.set(null);
	}

	ngOnDestroy(): void {
		this.#authStateUnsubscribe();
	}
}
