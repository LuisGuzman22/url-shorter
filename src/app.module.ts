import { Module } from '@nestjs/common';
import { UrlShortenerService } from './application/services/url-shortener.service';
import { UuidGeneratorService } from './application/services/uuid-generator.service';
import { CacheService } from './application/services/cache.service';
import { UrlController } from './infrastructure/controllers/url.controller';
import { UrlProcessService } from './application/services/url-process.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegistrationService } from './core/services/registration-service/registration-service.service';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: 'redis',
        port: 6379,
      },
    }),
  ],

  controllers: [UrlController],
  providers: [
    UrlShortenerService,
    UuidGeneratorService,
    CacheService,
    UrlProcessService,
    RegistrationService,
  ],
})
export class AppModule {}
