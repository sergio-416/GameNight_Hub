import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { vi } from 'vitest';
import { AuthService } from './auth';

const mockSignInWithPopup = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChanged = vi.fn();

vi.mock('@angular/fire/auth', () => ({
	signInWithPopup: (...args: unknown[]) => mockSignInWithPopup(...args),
	signOut: (...args: unknown[]) => mockSignOut(...args),
	onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),

	GoogleAuthProvider: class MockGoogleAuthProvider {},
	Auth: class MockAuth {},
}));

describe('AuthService', () => {
	let service: AuthService;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('login', () => {
		beforeEach(() => {
			mockOnAuthStateChanged.mockReturnValue(() => {});

			TestBed.configureTestingModule({
				providers: [AuthService, { provide: Auth, useValue: {} }],
			});

			service = TestBed.inject(AuthService);
		});

		it('should sign in with Google popup', async () => {
			const mockUser = { uid: 'user-123', email: 'test@example.com' };
			mockSignInWithPopup.mockResolvedValue({ user: mockUser });

			await service.login();

			expect(mockSignInWithPopup).toHaveBeenCalled();
		});

		it('should update currentUser signal on successful login', async () => {
			const mockUser = { uid: 'user-123', email: 'test@example.com' };
			mockSignInWithPopup.mockResolvedValue({ user: mockUser });

			await service.login();

			expect(service.currentUser()).toEqual(mockUser);
		});
	});

	describe('logout', () => {
		beforeEach(() => {
			mockOnAuthStateChanged.mockReturnValue(() => {});

			TestBed.configureTestingModule({
				providers: [AuthService, { provide: Auth, useValue: {} }],
			});

			service = TestBed.inject(AuthService);
		});

		it('should call signOut', async () => {
			mockSignOut.mockResolvedValue(undefined);

			await service.logout();

			expect(mockSignOut).toHaveBeenCalled();
		});

		it('should clear currentUser signal', async () => {
			mockSignOut.mockResolvedValue(undefined);

			await service.logout();

			expect(service.currentUser()).toBeNull();
		});
	});

	describe('auth state', () => {
		it('should set currentUser when auth state changes to logged in', () => {
			const mockUser = { uid: 'user-123', email: 'test@example.com' };
			let authStateCallback: Function;

			// Setup mock BEFORE creating service
			mockOnAuthStateChanged.mockImplementation((auth, callback) => {
				authStateCallback = callback;
				return () => {};
			});

			TestBed.configureTestingModule({
				providers: [AuthService, { provide: Auth, useValue: {} }],
			});

			service = TestBed.inject(AuthService);

			authStateCallback!(mockUser);

			expect(service.currentUser()).toEqual(mockUser);
		});

		it('should clear currentUser when auth state changes to logged out', () => {
			let authStateCallback: Function;

			mockOnAuthStateChanged.mockImplementation((auth, callback) => {
				authStateCallback = callback;
				return () => {};
			});

			TestBed.configureTestingModule({
				providers: [AuthService, { provide: Auth, useValue: {} }],
			});

			service = TestBed.inject(AuthService);
			authStateCallback!(null);

			expect(service.currentUser()).toBeNull();
		});
	});

	describe('isLoggedIn', () => {
		it('should return true when user is logged in', () => {
			const mockUser = { uid: 'user-123', email: 'test@example.com' };
			let authStateCallback: Function;

			mockOnAuthStateChanged.mockImplementation((auth, callback) => {
				authStateCallback = callback;
				return () => {};
			});

			TestBed.configureTestingModule({
				providers: [AuthService, { provide: Auth, useValue: {} }],
			});

			service = TestBed.inject(AuthService);
			authStateCallback!(mockUser);

			expect(service.isLoggedIn()).toBe(true);
		});

		it('should return false when user is logged out', () => {
			let authStateCallback: Function;

			mockOnAuthStateChanged.mockImplementation((auth, callback) => {
				authStateCallback = callback;
				return () => {};
			});

			TestBed.configureTestingModule({
				providers: [AuthService, { provide: Auth, useValue: {} }],
			});

			service = TestBed.inject(AuthService);
			authStateCallback!(null);

			expect(service.isLoggedIn()).toBe(false);
		});
	});
});
