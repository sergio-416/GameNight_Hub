import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@application/auth.service';
import { VerifyTokenDto } from '@presentation/dto/verify-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  async verify(@Body() body: VerifyTokenDto) {
    if (!body.token) {
      throw new UnauthorizedException('No token provided');
    }
    return await this.authService.verifyToken(body.token);
  }
}
