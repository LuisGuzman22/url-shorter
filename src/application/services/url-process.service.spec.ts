import { Test, TestingModule } from '@nestjs/testing';
import { UrlProcessService } from './url-process.service';
import { UuidGeneratorService } from './uuid-generator.service';
import { CacheService } from './cache.service';
import { RegistrationService } from '../../core/services/registration-service/registration-service.service';
import { INVALID_URL } from '../../constants/index';
import { ShortUrl } from '../dto/response/create-url.response.dto';

describe('UrlProcessService', () => {
  let service: UrlProcessService;
  let uuidGeneratorService: UuidGeneratorService;
  let cacheService: CacheService;
  let registrationService: RegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlProcessService,
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
        {
          provide: RegistrationService,
          useValue: {
            registerUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlProcessService>(UrlProcessService);
    uuidGeneratorService =
      module.get<UuidGeneratorService>(UuidGeneratorService);
    cacheService = module.get<CacheService>(CacheService);
    registrationService = module.get<RegistrationService>(RegistrationService);
  });

  describe('shortener', () => {
    it('should return a CreateUrlResponseDto with a list of ShortUrl', async () => {
      const urls = ['https://example.com'];
      jest.spyOn(service as any, 'processUrl').mockResolvedValue({
        shortUrl: 'shortUrl',
        longUrl: 'https://example.com',
      } as ShortUrl);

      const result = await service.shortener(urls);

      expect(result).toEqual({
        shortList: [
          {
            shortUrl: 'shortUrl',
            longUrl: 'https://example.com',
          },
        ],
      });
    });
  });

  describe('processUrl', () => {
    it('should return ShortUrl for a valid URL', async () => {
      const url = 'https://example.com';
      jest.spyOn(service as any, 'validateUrl').mockReturnValue(true);
      jest.spyOn(service as any, 'mapUrlToId').mockResolvedValue('shortUrl');
      jest.spyOn(service as any, 'registerUrl').mockResolvedValue(null);

      const result = await service['processUrl'](url);

      expect(result).toEqual({
        shortUrl: 'shortUrl',
        longUrl: 'https://example.com',
      });
    });

    it('should return ShortUrl with invalid URL for an invalid URL', async () => {
      const url = 'invalid-url';
      jest.spyOn(service as any, 'validateUrl').mockReturnValue(false);

      const result = await service['processUrl'](url);

      expect(result).toEqual({
        shortUrl: INVALID_URL,
        longUrl: 'invalid-url',
      });
    });
  });

  describe('restoreUrl', () => {
    it('should return the original URL', async () => {
      const key = 'shortUrl';
      const originalUrl = 'https://example.com';
      jest.spyOn(cacheService, 'getValue').mockResolvedValue(originalUrl);
      jest.spyOn(service as any, 'registerUrl').mockResolvedValue(null);

      const result = await service.restoreUrl(key);

      expect(result).toBe(originalUrl);
    });
  });

  describe('deleteUrl', () => {
    it('should call cacheService.deleteValue', async () => {
      const key = 'shortUrl';
      jest.spyOn(service as any, 'registerUrl').mockResolvedValue(null);
      const deleteValueSpy = jest
        .spyOn(cacheService, 'deleteValue')
        .mockResolvedValue(null);

      await service.deleteUrl(key);

      expect(deleteValueSpy).toHaveBeenCalledWith(key);
    });
  });
});
