import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { createClient } from 'redis';

@Module({
  providers: [
    CacheService,
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
  exports: [CacheService, 'REDIS_CLIENT'],
})
export class CacheModule {}
