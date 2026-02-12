import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUser } from '@domain/interfaces/auth-user.interface';

@Injectable()
export class AuthService {
  verifyToken(token: string): AuthUser {
    if (!token || token.trim() === '') {
      throw new UnauthorizedException('No token provided');
    }

    if (token === 'valid-firebase-token') {
      return {
        uid: 'test-user-123',
        email: 'test@example.com',
      };
    }

    throw new UnauthorizedException('Invalid token');
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    return authHeader.substring(7);
  }
}
