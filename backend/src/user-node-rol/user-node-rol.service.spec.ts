import { Test, TestingModule } from '@nestjs/testing';
import { UserNodeRolService } from './user-node-rol.service';

describe('UserNodeRolService', () => {
  let service: UserNodeRolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserNodeRolService],
    }).compile();

    service = module.get<UserNodeRolService>(UserNodeRolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
