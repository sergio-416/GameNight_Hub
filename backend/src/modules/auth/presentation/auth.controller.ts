import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@application/auth.service';
import { VerifyTokenDto } from './dto/verify-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  verify(@Body() body: VerifyTokenDto) {
    if (!body.token) {
      throw new UnauthorizedException('No token provided');
    }

    return this.authService.verifyToken(body.token);
  }
}
