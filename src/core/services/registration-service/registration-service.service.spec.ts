import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { Logger } from '@nestjs/common';
import { RegisterUrl } from '../../../application/dto/domain/register-url.dto';
import { RegistrationService } from './registration-service.service';

jest.mock('axios');

describe('RegistrationService', () => {
  let service: RegistrationService;
  let logger: Logger;

  beforeEach(async () => {
    logger = new Logger(RegistrationService.name);
    jest.spyOn(logger, 'error').mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistrationService],
    }).compile();

    service = module.get<RegistrationService>(RegistrationService);
  });

  describe('registerUrl', () => {
    it('should call axios.post with the correct URL and data', async () => {
      const data: RegisterUrl = {
        shortUrl: 'shortUrl',
        originalUrl: 'https://example.com',
        action: 'CREATE',
      };
      const postSpy = jest
        .spyOn(axios, 'post')
        .mockResolvedValue({ status: 200 });

      await service.registerUrl(data);

      expect(postSpy).toHaveBeenCalledWith('http://localhost:3001/url', data);
    });
  });
});
