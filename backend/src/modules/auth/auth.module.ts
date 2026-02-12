import { Module } from '@nestjs/common';
import { AuthController } from '@presentation/auth.controller';
import { AuthService } from '@application/auth.service';
import { FirebaseAuthGuard } from '@infrastructure/guards/firebase-auth.guard';
import { FirebaseAdminProvider } from '@infrastructure/firebase/firebase-admin.provider';

@Module({
  controllers: [AuthController],
  providers: [AuthService, FirebaseAuthGuard, FirebaseAdminProvider],
  exports: [AuthService, FirebaseAuthGuard],
})
export class AuthModule {}
