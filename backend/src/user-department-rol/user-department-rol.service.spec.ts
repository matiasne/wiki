import { Test, TestingModule } from '@nestjs/testing';
import { UserDepartmentRolService } from './user-department-rol.service';

describe('UserDepartmentRolService', () => {
  let service: UserDepartmentRolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDepartmentRolService],
    }).compile();

    service = module.get<UserDepartmentRolService>(UserDepartmentRolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
