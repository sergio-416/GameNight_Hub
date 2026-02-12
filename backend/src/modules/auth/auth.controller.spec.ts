import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    verifyToken: vi.fn(),
    extractTokenFromHeader: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('verify', () => {
    it('should return user data when valid token provided', () => {
      const token = 'valid-firebase-token';
      const expectedUser = { uid: 'test-user-123', email: 'test@example.com' };
      mockAuthService.verifyToken.mockReturnValue(expectedUser);

      const result = controller.verify({ token });

      expect(result).toEqual(expectedUser);
      expect(mockAuthService.verifyToken).toHaveBeenCalledWith(token);
    });

    it('should throw UnauthorizedException when token is invalid', () => {
      const token = 'invalid-token';
      mockAuthService.verifyToken.mockImplementation(() => {
        throw new UnauthorizedException();
      });

      expect(() => controller.verify({ token })).toThrow(UnauthorizedException);
    });
  });
});
