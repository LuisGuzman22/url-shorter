// @Module({
//   imports: [
//     UrlModule,
//     ServicesModule,
//     CacheModule,
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: 'myuser',
//       password: 'mypassword',
//       database: 'mydatabase',
//       entities: [UrlEntity],
//       synchronize: true,
//     }),
//     TypeOrmModule.forFeature([UrlEntity]),
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { UrlShortenerService } from './application/services/url-shortener.service';
import { UuidGeneratorService } from './application/services/uuid-generator.service';
import { CacheService } from './application/services/cache.service';
import { createClient } from 'redis';
import { UrlController } from './infrastructure/controllers/url.controller';
import { UrlProcessService } from './application/services/url-process.service';

@Module({
  imports: [],
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
  ],
})
export class AppModule {}
