import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '@application/auth.service';
import { vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { AuthUser } from '@domain/interfaces/auth-user.interface';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    verifyToken: vi.fn(),
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
    it('should return user data when valid token provided', async () => {
      const token = 'valid-firebase-token';
      const expectedUser: AuthUser = {
        uid: 'user-123',
        email: 'test@test.com',
      };
      mockAuthService.verifyToken.mockResolvedValue(expectedUser);

      const result = await controller.verify({ token });

      expect(result).toEqual(expectedUser);
      expect(mockAuthService.verifyToken).toHaveBeenCalledWith(token);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      const token = 'invalid-token';
      mockAuthService.verifyToken.mockRejectedValue(
        new UnauthorizedException(),
      );

      await expect(controller.verify({ token })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when no token provided', async () => {
      await expect(controller.verify({ token: '' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
