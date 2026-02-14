import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { render, screen, fireEvent } from '@testing-library/angular';
import { signal } from '@angular/core';
import { Header } from './header';
import { AuthService } from '@core/services/auth';

describe('Header Navigation', () => {
	let fixture: ComponentFixture<Header>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Header],
			providers: [
				provideRouter([]),
				{
					provide: AuthService,
					useValue: {
						isLoggedIn: signal(false),
						currentUser: signal(null),
						login: vi.fn(),
						logout: vi.fn(),
					},
				},
			],
		}).compileComponents();
		fixture = TestBed.createComponent(Header);
		await fixture.whenStable();
	});

	it('should display all navigation links', () => {
		const compiled = fixture.nativeElement as HTMLElement;
		const links = compiled.querySelectorAll('a');

		expect(links.length).toBe(6);

		const linkTexts = Array.from(links).map((link) => link.textContent?.trim());

		expect(linkTexts).toContain('Home');
		expect(linkTexts).toContain('Collection');
		expect(linkTexts).toContain('Game Nights');
		expect(linkTexts).toContain('Calendar');
		expect(linkTexts).toContain('Stats');
	});
});

describe('Header Authentication', () => {
	const mockLogin = vi.fn();
	const mockLogout = vi.fn();

	const mockAuthService = {
		isLoggedIn: signal(false),
		currentUser: signal<{
			photoURL: string | null;
			displayName: string | null;
		} | null>(null),
		login: mockLogin,
		logout: mockLogout,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockAuthService.isLoggedIn.set(false);
		mockAuthService.currentUser.set(null);
	});

	it('should display login button when user is not authenticated', async () => {
		await render(Header, {
			providers: [provideRouter([]), { provide: AuthService, useValue: mockAuthService }],
		});

		const loginButton = screen.getByRole('button', { name: /login/i });

		expect(loginButton).toBeTruthy();
	});

	it('should display user avatar when user is authenticated', async () => {
		mockAuthService.isLoggedIn.set(true);
		mockAuthService.currentUser.set({
			photoURL: 'https://example.com/avatar.jpg',
			displayName: 'Test User',
		});

		await render(Header, {
			providers: [provideRouter([]), { provide: AuthService, useValue: mockAuthService }],
		});

		const avatar = screen.getByAltText('User avatar');

		expect(avatar).toBeTruthy();
	});

	it('should call login method when login button is clicked', async () => {
		await render(Header, {
			providers: [provideRouter([]), { provide: AuthService, useValue: mockAuthService }],
		});

		const loginButton = screen.getByRole('button', { name: /login/i });
		fireEvent.click(loginButton);

		expect(mockLogin).toHaveBeenCalledTimes(1);
	});
});
