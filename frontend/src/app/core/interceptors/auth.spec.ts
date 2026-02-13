import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { Auth } from '@angular/fire/auth';
import { authInterceptor } from './auth';

const mockGetIdToken = vi.fn();

const mockAuth: {
	currentUser: { getIdToken: typeof mockGetIdToken } | null;
} = {
	currentUser: {
		getIdToken: mockGetIdToken,
	},
};

vi.mock('@angular/fire/auth', () => ({
	Auth: vi.fn(),
}));

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('AuthInterceptor', () => {
	let httpClient: HttpClient;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		vi.clearAllMocks();
		mockAuth.currentUser = {
			getIdToken: mockGetIdToken,
		};

		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(withInterceptors([authInterceptor])),
				provideHttpClientTesting(),
				{ provide: Auth, useValue: mockAuth },
			],
		});

		httpClient = TestBed.inject(HttpClient);
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	describe('when user is authenticated', () => {
		it('should add Authorization header with Bearer token', async () => {
			const mockToken = 'firebase-id-token-123';
			mockGetIdToken.mockResolvedValue(mockToken);

			const testData = { message: 'test' };

			httpClient.get('/api/test').subscribe();

			await flushPromises();

			const req = httpTestingController.expectOne('/api/test');

			expect(req.request.headers.has('Authorization')).toBe(true);
			expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

			req.flush(testData);
		});
	});

	describe('when user is not authenticated', () => {
		it('should not add Authorization header', async () => {
			mockAuth.currentUser = null;

			const testData = { message: 'test' };

			httpClient.get('/api/test').subscribe();

			await flushPromises();

			const req = httpTestingController.expectOne('/api/test');

			expect(req.request.headers.has('Authorization')).toBe(false);

			req.flush(testData);
		});
	});

	describe('when getIdToken fails', () => {
		it('should proceed without Authorization header', async () => {
			mockGetIdToken.mockRejectedValue(new Error('Token expired'));

			const testData = { message: 'test' };

			httpClient.get('/api/test').subscribe();

			await flushPromises();

			const req = httpTestingController.expectOne('/api/test');

			expect(req.request.headers.has('Authorization')).toBe(false);

			req.flush(testData);
		});
	});
});
