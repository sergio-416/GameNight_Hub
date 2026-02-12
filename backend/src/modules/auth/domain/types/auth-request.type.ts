import { AuthUser } from '@domain/interfaces/auth-user.interface';

export interface AuthRequest {
  headers: {
    authorization?: string;
  };
  user?: AuthUser;
}
