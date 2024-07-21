import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { RedisClientType } from 'redis';

jest.mock('redis', () => ({
  createClient: jest.fn().mockReturnValue({
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  }),
}));

describe('CacheService', () => {
  let cacheService: CacheService;
  let redisClient: jest.Mocked<RedisClientType<any, any>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: 'REDIS_CLIENT',
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    cacheService = module.get<CacheService>(CacheService);
    redisClient = module.get('REDIS_CLIENT');
  });

  describe('setValue', () => {
    it('should return true when value is set successfully', async () => {
      redisClient.set.mockResolvedValue('OK');

      const result = await cacheService.setValue('key', 'value');
      expect(result).toBe(true);
      expect(redisClient.set).toHaveBeenCalledWith('key', 'value');
    });

    it('should return false when value is not set successfully', async () => {
      redisClient.set.mockResolvedValue('ERROR');

      const result = await cacheService.setValue('key', 'value');
      expect(result).toBe(false);
      expect(redisClient.set).toHaveBeenCalledWith('key', 'value');
    });
  });

  describe('getValue', () => {
    it('should return value when key is found', async () => {
      redisClient.get.mockResolvedValue('value');

      const result = await cacheService.getValue('key');
      expect(result).toBe('value');
      expect(redisClient.get).toHaveBeenCalledWith('key');
    });

    it('should return null when key is not found', async () => {
      redisClient.get.mockResolvedValue(null);

      const result = await cacheService.getValue('key');
      expect(result).toBeNull();
      expect(redisClient.get).toHaveBeenCalledWith('key');
    });
  });

  describe('deleteValue', () => {
    it('should delete the key', async () => {
      redisClient.del.mockResolvedValue(1);

      await cacheService.deleteValue('key');
      expect(redisClient.del).toHaveBeenCalledWith('key');
    });
  });
});
