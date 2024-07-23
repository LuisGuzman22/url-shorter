import { Module } from '@nestjs/common';
import { UrlShortenerService } from './application/services/url-shortener.service';
import { UuidGeneratorService } from './application/services/uuid-generator.service';
import { CacheService } from './application/services/cache.service';
import { createClient } from 'redis';
import { UrlController } from './infrastructure/controllers/url.controller';
import { UrlProcessService } from './application/services/url-process.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'nestjs-redis';
import { RegistrationService } from './core/services/registration-service/registration-service.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  // imports: [
  //   ConfigModule.forRoot({
  //     isGlobal: true,
  //   }),
  //   RedisModule.forRootAsync({
  //     imports: [ConfigModule],
  //     useFactory: async (configService: ConfigService) => ({
  //       host: configService.get<string>('REDIS_HOST'),
  //       port: configService.get<number>('REDIS_PORT'),
  //     }),
  //     inject: [ConfigService],
  //   }),
  // ],
  controllers: [UrlController],
  providers: [
    UrlShortenerService,
    UuidGeneratorService,
    CacheService,
    UrlProcessService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = createClient({
          url: 'redis://localhost:6379',
        });
        await client.connect();
        return client;
      },
    },
    RegistrationService,
  ],
})
export class AppModule {}
