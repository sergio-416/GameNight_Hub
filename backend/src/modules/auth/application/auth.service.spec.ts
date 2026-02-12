import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@application/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { vi } from 'vitest';
import { FirebaseAdminProvider } from '@infrastructure/firebase/firebase-admin.provider';

const mockVerifyIdToken = vi.fn();
const mockGetAuth = vi.fn().mockReturnValue({
  verifyIdToken: mockVerifyIdToken,
});

const mockFirebaseAdminProvider = {
  getAuth: mockGetAuth,
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: FirebaseAdminProvider,
          useValue: mockFirebaseAdminProvider,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('verifyToken', () => {
    it('should throw UnauthorizedException when no token provided', async () => {
      await expect(service.verifyToken('')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return decoded user when valid Firebase token provided', async () => {
      const firebaseUser = {
        uid: 'firebase-uid-123',
        email: 'user@example.com',
      };

      mockVerifyIdToken.mockResolvedValue(firebaseUser);

      const result = await service.verifyToken('valid-firebase-token');

      expect(result).toEqual({
        uid: 'firebase-uid-123',
        email: 'user@example.com',
      });
      expect(mockVerifyIdToken).toHaveBeenCalledWith('valid-firebase-token');
    });

    it('should extract userId from decoded token', async () => {
      mockVerifyIdToken.mockResolvedValue({
        uid: 'firebase-uid-123',
        email: 'user@example.com',
      });

      const result = await service.verifyToken('valid-firebase-token');

      expect(result.uid).toBe('firebase-uid-123');
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from Bearer header', () => {
      const authHeader = 'Bearer valid-token-123';
      const result = service.extractTokenFromHeader(authHeader);
      expect(result).toBe('valid-token-123');
    });

    it('should return null for non-Bearer header', () => {
      const authHeader = 'Basic valid-token-123';
      const result = service.extractTokenFromHeader(authHeader);
      expect(result).toBeNull();
    });

    it('should return null when no header provided', () => {
      const result = service.extractTokenFromHeader('');
      expect(result).toBeNull();
    });
  });
});
