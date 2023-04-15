import { Test, TestingModule } from '@nestjs/testing';
import { ContentNodeService } from './content-node.service';

describe('ContentNodeService', () => {
  let service: ContentNodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentNodeService],
    }).compile();

    service = module.get<ContentNodeService>(ContentNodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
