import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  verify(@Body() body: { token: string }) {
    if (!body.token) {
      throw new UnauthorizedException('No token provided');
    }

    return this.authService.verifyToken(body.token);
  }
}
