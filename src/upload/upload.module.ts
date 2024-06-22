import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { envs } from '../config/envs';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        { 
          limit: envs.uploadRateLimit,
          ttl: envs.uploadRateTtl, 
        }
      ]
    })
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class UploadModule {}
