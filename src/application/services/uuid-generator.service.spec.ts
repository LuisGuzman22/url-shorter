import { Test, TestingModule } from '@nestjs/testing';
import { UuidGeneratorService } from './uuid-generator.service';
import { nanoid } from 'nanoid';

jest.mock('nanoid');

describe('UuidGeneratorService', () => {
  let service: UuidGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UuidGeneratorService],
    }).compile();

    service = module.get<UuidGeneratorService>(UuidGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateUUID', () => {
    it('should generate a UUID of length 6', () => {
      const mockUUID = 'abc123';
      (nanoid as jest.Mock).mockReturnValue(mockUUID);

      const uuid = service.generateUUID();

      expect(nanoid).toHaveBeenCalledWith(6);
      expect(uuid).toBe(mockUUID);
    });
  });
});
