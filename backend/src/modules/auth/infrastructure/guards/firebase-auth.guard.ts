import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@application/auth.service';
import { AuthRequest } from '@domain/types/auth-request.type';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = this.authService.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decodedUser = this.authService.verifyToken(token);
      request.user = decodedUser;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
