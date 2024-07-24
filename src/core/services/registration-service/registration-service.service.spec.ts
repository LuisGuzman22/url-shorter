import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { RegisterUrl } from 'src/application/dto/domain/register-url.dto';
import { RegistrationService } from './registration-service.service';

jest.mock('axios');

describe('RegistrationService', () => {
  let service: RegistrationService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistrationService],
    }).compile();

    service = module.get<RegistrationService>(RegistrationService);
    logger = new Logger(RegistrationService.name);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a URL successfully', async () => {
    const data: RegisterUrl = {
      shortUrl: 'short',
      originalUrl: 'http://example.com',
      action: 'create',
    };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: 'OK' });

    await expect(service.registerUrl(data)).resolves.toBeUndefined();
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.PROCESS_QUEUE_URL}/url`,
      data,
    );
  });

  it('should handle errors and log them', async () => {
    const data: RegisterUrl = {
      shortUrl: 'short',
      originalUrl: 'http://example.com',
      action: 'create',
    };
    const error = new Error('Network error');
    (axios.post as jest.Mock).mockRejectedValueOnce(error);

    const loggerSpy = jest.spyOn(Logger.prototype, 'error');

    await service.registerUrl(data);

    expect(loggerSpy).toHaveBeenCalledWith('error on register url', error);
  });
});
