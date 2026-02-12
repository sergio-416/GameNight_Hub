import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('verifyToken', () => {
    it('should throw UnauthorizedException when no token provided', () => {
      expect(() => service.verifyToken('')).toThrow(UnauthorizedException);
      expect(() => service.verifyToken(null as unknown as string)).toThrow(
        UnauthorizedException,
      );
      expect(() => service.verifyToken(undefined as unknown as string)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for malformed token', () => {
      const malformedToken = 'not-a-valid-token';

      expect(() => service.verifyToken(malformedToken)).toThrow(
        UnauthorizedException,
      );
    });

    it('should return decoded user when valid token provided', () => {
      const validToken = 'valid-firebase-token';
      const expectedUser = {
        uid: 'test-user-123',
        email: 'test@example.com',
      };

      const result = service.verifyToken(validToken);

      expect(result).toEqual(expectedUser);
    });

    it('should extract userId from decoded token', () => {
      const validToken = 'valid-firebase-token';

      const result = service.verifyToken(validToken);

      expect(result.uid).toBe('test-user-123');
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
