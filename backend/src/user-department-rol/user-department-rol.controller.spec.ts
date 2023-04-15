import { Test, TestingModule } from '@nestjs/testing';
import { UserDepartmentRolController } from './user-department-rol.controller';
import { UserDepartmentRolService } from './user-department-rol.service';

describe('UserDepartmentRolController', () => {
  let controller: UserDepartmentRolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserDepartmentRolController],
      providers: [UserDepartmentRolService],
    }).compile();

    controller = module.get<UserDepartmentRolController>(UserDepartmentRolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
