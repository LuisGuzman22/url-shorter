import { Test, TestingModule } from '@nestjs/testing';
import { UrlProcessorService } from './url-processor.service';
import { UuidGeneratorService } from '../uuid-generator/uuid-generator.service';
import { CacheService } from '../../cache/cache.service';
import { Logger } from '@nestjs/common';

describe('UrlProcessorService', () => {
  let urlProcessorService: UrlProcessorService;
  let uuidGeneratorService: UuidGeneratorService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlProcessorService,
        {
          provide: UuidGeneratorService,
          useValue: {
            generateUUID: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            getValue: jest.fn(),
            setValue: jest.fn(),
            deleteValue: jest.fn(),
          },
        },
      ],
    }).compile();

    urlProcessorService = module.get<UrlProcessorService>(UrlProcessorService);
    uuidGeneratorService =
      module.get<UuidGeneratorService>(UuidGeneratorService);
    cacheService = module.get<CacheService>(CacheService);
  });

  describe('shortener', () => {
    it('should shorten url list', async () => {
      const urlList = ['http://example.com'];
      const shortUrls = ['http://localhost:3000/url/restore/uuid1'];

      jest
        .spyOn(urlProcessorService as any, 'mapUrlToId')
        .mockResolvedValue(shortUrls[0]);

      const result = await urlProcessorService.shortener(urlList);
      expect(result).toEqual(shortUrls);
    });
  });

  describe('restoreUrl', () => {
    it('should restore the url from cache', async () => {
      const key = 'shortKey';
      const longUrl = 'http://example.com';

      jest.spyOn(cacheService, 'getValue').mockResolvedValue(longUrl);

      const result = await urlProcessorService.restoreUrl(key);
      expect(result).toEqual(longUrl);
      expect(cacheService.getValue).toHaveBeenCalledWith(key);
    });
  });

  describe('deleteUrl', () => {
    it('should delete the url from cache', async () => {
      const key = 'shortKey';

      jest.spyOn(cacheService, 'deleteValue').mockResolvedValue(undefined);

      await urlProcessorService.deleteUrl(key);
      expect(cacheService.deleteValue).toHaveBeenCalledWith(key);
    });
  });

  describe('mapUrlToId', () => {
    it('should map url to id and save in cache', async () => {
      const url = 'http://example.com';
      const id = 'uuid1';
      const generatedUrl = `http://localhost:3000/url/restore/${id}`;

      jest.spyOn(uuidGeneratorService, 'generateUUID').mockReturnValue(id);
      jest
        .spyOn(urlProcessorService as any, 'saveCache')
        .mockResolvedValue(true);
      jest
        .spyOn(urlProcessorService as any, 'generateUrl')
        .mockReturnValue(generatedUrl);

      const result = await (urlProcessorService as any).mapUrlToId(url);
      expect(result).toEqual(generatedUrl);
      expect(uuidGeneratorService.generateUUID).toHaveBeenCalled();
      expect((urlProcessorService as any).saveCache).toHaveBeenCalledWith(
        id,
        url,
      );
    });

    it('should return "not processed" if cache save fails', async () => {
      const url = 'http://example.com';
      const id = 'uuid1';

      jest.spyOn(uuidGeneratorService, 'generateUUID').mockReturnValue(id);
      jest
        .spyOn(urlProcessorService as any, 'saveCache')
        .mockResolvedValue(false);
      const loggerSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation(() => {});

      const result = await (urlProcessorService as any).mapUrlToId(url);
      expect(result).toEqual('not processed');
      expect(loggerSpy).toHaveBeenCalledWith('url not processed');
    });
  });
});
