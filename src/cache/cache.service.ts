import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType<any, any>,
  ) {}

  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async getValue(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }
}
