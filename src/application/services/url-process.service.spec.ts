import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { UrlProcessService } from './url-process.service';
import { UuidGeneratorService } from './uuid-generator.service';
import { CacheService } from './cache.service';

jest.mock('./uuid-generator.service');
jest.mock('./cache.service');

describe('UrlProcessService', () => {
  let service: UrlProcessService;
  let uuidGeneratorService: UuidGeneratorService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlProcessService, UuidGeneratorService, CacheService],
    }).compile();

    service = module.get<UrlProcessService>(UrlProcessService);
    uuidGeneratorService =
      module.get<UuidGeneratorService>(UuidGeneratorService);
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shortener', () => {
    it('should return a list of shortened URLs', async () => {
      const urlList = ['http://example.com', 'invalid-url'];
      const mockShortUrl = 'http://localhost:3000/url/abc123';

      jest
        .spyOn(service as any, 'validateUrl')
        .mockImplementation((url) => url === 'http://example.com');
      jest.spyOn(service as any, 'mapUrlToId').mockResolvedValue(mockShortUrl);

      const result = await service.shortener(urlList);

      expect(result).toEqual([
        { shortUrl: mockShortUrl, longUrl: 'http://example.com' },
        { shortUrl: 'invalid url', longUrl: 'invalid-url' },
      ]);
    });
  });

  describe('restoreUrl', () => {
    it('should return the original URL from cache', async () => {
      const key = 'abc123';
      const longUrl = 'http://example.com';
      cacheService.getValue = jest.fn().mockResolvedValue(longUrl);

      const result = await service.restoreUrl(key);

      expect(result).toBe(longUrl);
      expect(cacheService.getValue).toHaveBeenCalledWith(key);
    });
  });

  describe('deleteUrl', () => {
    it('should delete the URL from cache', async () => {
      const key = 'abc123';
      cacheService.deleteValue = jest.fn().mockResolvedValue(undefined);

      await service.deleteUrl(key);

      expect(cacheService.deleteValue).toHaveBeenCalledWith(key);
    });
  });

  describe('validateUrl', () => {
    it('should return true for a valid URL', () => {
      const url = 'http://example.com';
      expect(service['validateUrl'](url)).toBe(true);
    });

    it('should return false for an invalid URL', () => {
      const url = 'invalid-url';
      expect(service['validateUrl'](url)).toBe(false);
    });
  });

  describe('generateUUID', () => {
    it('should return a generated UUID', () => {
      const uuid = 'abc123';
      uuidGeneratorService.generateUUID = jest.fn().mockReturnValue(uuid);

      const result = service['generateUUID']();

      expect(result).toBe(uuid);
      expect(uuidGeneratorService.generateUUID).toHaveBeenCalled();
    });
  });

  describe('saveCache', () => {
    it('should save a value in the cache', async () => {
      const key = 'abc123';
      const value = 'http://example.com';
      cacheService.setValue = jest.fn().mockResolvedValue(true);

      const result = await service['saveCache'](key, value);

      expect(result).toBe(true);
      expect(cacheService.setValue).toHaveBeenCalledWith(key, value);
    });
  });

  describe('mapUrlToId', () => {
    it('should return a shortened URL if the URL is successfully cached', async () => {
      const url = 'http://example.com';
      const key = 'abc123';
      const mockShortUrl = 'http://localhost:3000/url/abc123';

      jest.spyOn(service as any, 'generateUUID').mockReturnValue(key);
      jest.spyOn(service as any, 'saveCache').mockResolvedValue(true);
      jest.spyOn(service as any, 'generateUrl').mockReturnValue(mockShortUrl);

      const result = await service['mapUrlToId'](url);

      expect(result).toBe(mockShortUrl);
      expect(service['generateUUID']).toHaveBeenCalled();
      expect(service['saveCache']).toHaveBeenCalledWith(key, url);
      expect(service['generateUrl']).toHaveBeenCalledWith(key);
    });

    it('should return "not processed" if the URL is not successfully cached', async () => {
      const url = 'http://example.com';
      const key = 'abc123';

      jest.spyOn(service as any, 'generateUUID').mockReturnValue(key);
      jest.spyOn(service as any, 'saveCache').mockResolvedValue(false);

      const result = await service['mapUrlToId'](url);

      expect(result).toBe('not processed');
      expect(service['generateUUID']).toHaveBeenCalled();
      expect(service['saveCache']).toHaveBeenCalledWith(key, url);
    });
  });

  describe('generateUrl', () => {
    it('should return a formatted URL', () => {
      const key = 'abc123';
      const result = service['generateUrl'](key);

      expect(result).toBe(`http://localhost:3000/url/${key}`);
    });
  });
});
