import { Test, TestingModule } from '@nestjs/testing';
import { ContentNodeController } from './content-node.controller';
import { ContentNodeService } from './content-node.service';

describe('ContentNodeController', () => {
  let controller: ContentNodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentNodeController],
      providers: [ContentNodeService],
    }).compile();

    controller = module.get<ContentNodeController>(ContentNodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
