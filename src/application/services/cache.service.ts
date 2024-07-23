import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async setValue(key: string, value: string): Promise<boolean> {
    const data = await this.redisClient.set(key, value);
    if (data !== 'OK') {
      return false;
    }
    return true;
  }

  async getValue(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }

  async deleteValue(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
