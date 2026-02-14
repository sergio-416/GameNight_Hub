import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { AuthService } from './core/services/auth';
import { signal } from '@angular/core';

describe('App', () => {
	const mockAuthService = {
		isLoggedIn: signal(false),
		currentUser: signal(null),
		login: vi.fn(),
		logout: vi.fn(),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [App],
			providers: [provideRouter([]), { provide: AuthService, useValue: mockAuthService }],
		}).compileComponents();
	});

	it('should render header component', () => {
		const fixture = TestBed.createComponent(App);
		fixture.detectChanges();

		const headerElement = fixture.nativeElement.querySelector('app-header');
		expect(headerElement).toBeTruthy();
	});

	it('should render router outlet', () => {
		const fixture = TestBed.createComponent(App);
		fixture.detectChanges();

		const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
		expect(routerOutlet).toBeTruthy();
	});
});
