import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType<any, any>,
  ) {}

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
