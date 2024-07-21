import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UrlProcessorService } from '../../services/url-processor/url-processor.service';

describe('UrlService', () => {
  let urlService: UrlService;
  let urlProcessorService: UrlProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: UrlProcessorService,
          useValue: {
            shortener: jest.fn(),
            restoreUrl: jest.fn(),
            deleteUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
    urlProcessorService = module.get<UrlProcessorService>(UrlProcessorService);
  });

  describe('shortener', () => {
    it('should shorten url list', async () => {
      const urlList = ['http://example.com'];
      const shortenedList = ['http://short.url'];
      jest
        .spyOn(urlProcessorService, 'shortener')
        .mockResolvedValue(shortenedList);

      const result = await urlService.shortener(urlList);
      expect(result).toEqual(shortenedList);
      expect(urlProcessorService.shortener).toHaveBeenCalledWith(urlList);
    });

    it('should throw BadRequestException if urlList is empty', async () => {
      await expect(urlService.shortener([])).rejects.toThrow(
        BadRequestException,
      );
      expect(urlProcessorService.shortener).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if urlList is null', async () => {
      await expect(urlService.shortener(null)).rejects.toThrow(
        BadRequestException,
      );
      expect(urlProcessorService.shortener).not.toHaveBeenCalled();
    });
  });

  describe('restoreUrl', () => {
    it('should restore the url and redirect', async () => {
      const key = 'shortKey';
      const longUrl = 'http://example.com';
      const res = {
        redirect: jest.fn(),
      };
      jest.spyOn(urlProcessorService, 'restoreUrl').mockResolvedValue(longUrl);

      await urlService.restoreUrl(key, res);
      expect(res.redirect).toHaveBeenCalledWith(longUrl);
      expect(urlProcessorService.restoreUrl).toHaveBeenCalledWith(key);
    });

    it('should throw NotFoundException if url is not found', async () => {
      const key = 'invalidKey';
      const res = {
        redirect: jest.fn(),
      };
      jest.spyOn(urlProcessorService, 'restoreUrl').mockResolvedValue(null);

      await expect(urlService.restoreUrl(key, res)).rejects.toThrow(
        NotFoundException,
      );
      expect(res.redirect).not.toHaveBeenCalled();
      expect(urlProcessorService.restoreUrl).toHaveBeenCalledWith(key);
    });
  });

  describe('deleteUrl', () => {
    it('should delete the url', async () => {
      const key = 'shortKey';
      jest.spyOn(urlProcessorService, 'deleteUrl').mockResolvedValue(undefined);

      await urlService.deleteUrl(key);
      expect(urlProcessorService.deleteUrl).toHaveBeenCalledWith(key);
    });
  });
});
