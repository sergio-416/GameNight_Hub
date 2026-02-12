import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { AuthService } from '@application/auth.service';
import { vi } from 'vitest';
import { AuthRequest } from '@domain/types/auth-request.type';
import { AuthUser } from '@domain/interfaces/auth-user.interface';

describe('FirebaseAuthGuard', () => {
  let guard: FirebaseAuthGuard;

  const mockAuthService = {
    extractTokenFromHeader: vi.fn(),
    verifyToken: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    guard = new FirebaseAuthGuard(mockAuthService as unknown as AuthService);
  });

  const createMockContext = (authHeader?: string): ExecutionContext => {
    const mockRequest: AuthRequest = {
      headers: authHeader ? { authorization: authHeader } : {},
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;
  };

  describe('canActivate', () => {
    it('should return true when valid token provided', () => {
      const context = createMockContext('Bearer valid-token');
      const decodedUser: AuthUser = { uid: 'user-123', email: 'test@test.com' };

      mockAuthService.extractTokenFromHeader.mockReturnValue('valid-token');
      mockAuthService.verifyToken.mockReturnValue(decodedUser);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockAuthService.extractTokenFromHeader).toHaveBeenCalledWith(
        'Bearer valid-token',
      );
      expect(mockAuthService.verifyToken).toHaveBeenCalledWith('valid-token');
    });

    it('should attach decoded user to request when token valid', () => {
      const context = createMockContext('Bearer valid-token');
      const decodedUser: AuthUser = { uid: 'user-123', email: 'test@test.com' };

      mockAuthService.extractTokenFromHeader.mockReturnValue('valid-token');
      mockAuthService.verifyToken.mockReturnValue(decodedUser);

      guard.canActivate(context);

      const request = context.switchToHttp().getRequest<AuthRequest>();
      expect(request.user).toEqual(decodedUser);
    });

    it('should throw UnauthorizedException when no authorization header', () => {
      const context = createMockContext();

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when no token in header', () => {
      const context = createMockContext('Bearer ');

      mockAuthService.extractTokenFromHeader.mockReturnValue(null);

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when token is invalid', () => {
      const context = createMockContext('Bearer invalid-token');

      mockAuthService.extractTokenFromHeader.mockReturnValue('invalid-token');
      mockAuthService.verifyToken.mockImplementation(() => {
        throw new UnauthorizedException();
      });

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });
  });
});
