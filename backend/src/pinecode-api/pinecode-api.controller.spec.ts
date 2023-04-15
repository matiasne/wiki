import { Test, TestingModule } from '@nestjs/testing';
import { PinecodeApiController } from './pinecode-api.controller';
import { PinecodeApiService } from '../services/pinecode-api.service';

describe('PinecodeApiController', () => {
  let controller: PinecodeApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PinecodeApiController],
      providers: [PinecodeApiService],
    }).compile();

    controller = module.get<PinecodeApiController>(PinecodeApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
