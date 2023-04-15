import { Test, TestingModule } from '@nestjs/testing';
import { UserNodeRolController } from './user-node-rol.controller';
import { UserNodeRolService } from './user-node-rol.service';

describe('UserNodeRolController', () => {
  let controller: UserNodeRolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserNodeRolController],
      providers: [UserNodeRolService],
    }).compile();

    controller = module.get<UserNodeRolController>(UserNodeRolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
