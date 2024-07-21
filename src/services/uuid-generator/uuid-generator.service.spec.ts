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

  describe('generateUUID', () => {
    it('should generate a UUID of length 6', () => {
      const mockUUID = 'abcdef';
      (nanoid as jest.Mock).mockReturnValue(mockUUID);

      const result = service.generateUUID();
      expect(result).toBe(mockUUID);
      expect(nanoid).toHaveBeenCalledWith(6);
    });
  });
});
