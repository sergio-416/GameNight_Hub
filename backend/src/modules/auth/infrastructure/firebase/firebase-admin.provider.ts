import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminProvider implements OnModuleInit {
  readonly #logger = new Logger(FirebaseAdminProvider.name);
  readonly #configService: ConfigService;

  constructor(configService: ConfigService) {
    this.#configService = configService;
  }

  onModuleInit(): void {
    if (admin.apps.length === 0) {
      const projectId = this.#configService.get<string>('FIREBASE_PROJECT_ID');
      const privateKey = this.#configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n');
      const clientEmail = this.#configService.get<string>(
        'FIREBASE_CLIENT_EMAIL',
      );

      if (!projectId || !privateKey || !clientEmail) {
        this.#logger.error('Firebase credentials not configured');
        throw new Error('Firebase credentials missing');
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey,
          clientEmail,
        }),
      });

      this.#logger.log('Firebase Admin initialized');
    }
  }

  getAuth() {
    return admin.auth();
  }
}
