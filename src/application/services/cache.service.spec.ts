import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { RedisClientType } from 'redis';

describe('CacheService', () => {
  let service: CacheService;
  let redisClient: RedisClientType<any, any>;

  beforeEach(async () => {
    redisClient = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    } as unknown as RedisClientType<any, any>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: 'REDIS_CLIENT',
          useValue: redisClient,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  describe('setValue', () => {
    it('should return true if Redis returns OK', async () => {
      jest.spyOn(redisClient, 'set').mockResolvedValue('OK');

      const result = await service.setValue('key', 'value');

      expect(result).toBe(true);
    });

    it('should return false if Redis does not return OK', async () => {
      jest.spyOn(redisClient, 'set').mockResolvedValue('NOT_OK');

      const result = await service.setValue('key', 'value');

      expect(result).toBe(false);
    });
  });

  describe('getValue', () => {
    it('should return the value from Redis', async () => {
      jest.spyOn(redisClient, 'get').mockResolvedValue('value');

      const result = await service.getValue('key');

      expect(result).toBe('value');
    });

    it('should return null if key does not exist', async () => {
      jest.spyOn(redisClient, 'get').mockResolvedValue(null);

      const result = await service.getValue('key');

      expect(result).toBe(null);
    });
  });

  describe('deleteValue', () => {
    it('should call Redis del with the correct key', async () => {
      const delSpy = jest.spyOn(redisClient, 'del').mockResolvedValue(1);

      await service.deleteValue('key');

      expect(delSpy).toHaveBeenCalledWith('key');
    });
  });
});
