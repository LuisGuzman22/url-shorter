import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlProcessService } from './url-process.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from '../dto/request/create-url.dto';
import {
  CreateUrlResponseDto,
  ShortUrl,
} from '../dto/response/create-url.response.dto';

describe('UrlShortenerService', () => {
  let service: UrlShortenerService;
  let urlProcessService: UrlProcessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerService,
        {
          provide: UrlProcessService,
          useValue: {
            shortener: jest.fn(),
            restoreUrl: jest.fn(),
            deleteUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlShortenerService>(UrlShortenerService);
    urlProcessService = module.get<UrlProcessService>(UrlProcessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shortenUrl', () => {
    it('should log an error and throw a BadRequestException if urlList is empty', async () => {
      const createUrlDto: CreateUrlDto = { urlList: [] };

      await expect(service.shortenUrl(createUrlDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should call urlProcessService.shortener with the urlList', async () => {
      const createUrlDto: CreateUrlDto = { urlList: ['http://example.com'] };
      const shortUrl: ShortUrl = {
        shortUrl: 'short',
        longUrl: 'http://example.com',
      };

      const response: CreateUrlResponseDto[] = [{ shortList: [shortUrl] }];
      (urlProcessService.shortener as jest.Mock).mockResolvedValue(response);

      const result = await service.shortenUrl(createUrlDto);

      expect(urlProcessService.shortener).toHaveBeenCalledWith(
        createUrlDto.urlList,
      );
      expect(result).toEqual(response);
    });
  });

  describe('getOriginalUrl', () => {
    it('should log an error and throw a NotFoundException if the key is not found', async () => {
      const key = 'nonexistent';
      (urlProcessService.restoreUrl as jest.Mock).mockResolvedValue(null);
      const res = { redirect: jest.fn() };

      await expect(service.getOriginalUrl(key, res)).rejects.toThrow(
        NotFoundException,
      );
      expect(urlProcessService.restoreUrl).toHaveBeenCalledWith(key);
    });

    it('should call res.redirect with the longUrl if the key is found', async () => {
      const key = 'existent';
      const longUrl = 'http://example.com';
      (urlProcessService.restoreUrl as jest.Mock).mockResolvedValue(longUrl);
      const res = { redirect: jest.fn() };

      await service.getOriginalUrl(key, res);

      expect(res.redirect).toHaveBeenCalledWith(longUrl);
    });
  });

  describe('deleteUrl', () => {
    it('should call urlProcessService.deleteUrl with the key', async () => {
      const key = 'key';
      await service.deleteUrl(key);

      expect(urlProcessService.deleteUrl).toHaveBeenCalledWith(key);
    });
  });

  describe('masiveUpload', () => {
    it('should call urlProcessService.shortener with the parsed urlList from file', async () => {
      const file = {
        buffer: Buffer.from(
          'http://example.com;http://example2.com\nhttp://example3.com;\r',
        ),
      } as Express.Multer.File;
      const shortUrl: ShortUrl = {
        shortUrl: 'short',
        longUrl: 'http://example.com',
      };

      const response: CreateUrlResponseDto[] = [{ shortList: [shortUrl] }];

      (urlProcessService.shortener as jest.Mock).mockResolvedValue(response);

      const result = await service.masiveUpload(file);

      expect(urlProcessService.shortener).toHaveBeenCalledWith([
        'http://example.com',
        'http://example2.com',
        'http://example3.com',
      ]);
      expect(result).toEqual(response);
    });
  });

  describe('trimUrl', () => {
    it('should return trimmed URL', () => {
      const url = '  http://example.com  \r';
      const result = service['trimUrl'](url);

      expect(result).toBe('http://example.com');
    });

    it('should return undefined for an empty URL', () => {
      const url = '  \r';
      const result = service['trimUrl'](url);

      expect(result).toBeUndefined();
    });
  });
});
