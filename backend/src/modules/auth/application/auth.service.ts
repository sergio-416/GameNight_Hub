import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUser } from '@domain/interfaces/auth-user.interface';
import { FirebaseAdminProvider } from '@infrastructure/firebase/firebase-admin.provider';

@Injectable()
export class AuthService {
  constructor(private readonly firebaseAdmin: FirebaseAdminProvider) {}

  async verifyToken(token: string): Promise<AuthUser> {
    if (!token || token.trim() === '') {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decodedToken = await this.firebaseAdmin
        .getAuth()
        .verifyIdToken(token);

      return {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    return authHeader.substring(7);
  }
}
