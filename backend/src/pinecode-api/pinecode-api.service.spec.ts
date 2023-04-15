import { Test, TestingModule } from '@nestjs/testing';
import { PinecodeApiService } from '../services/pinecode-api.service';

describe('PinecodeApiService', () => {
  let service: PinecodeApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PinecodeApiService],
    }).compile();

    service = module.get<PinecodeApiService>(PinecodeApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
