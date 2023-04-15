import { Controller, Delete, Param } from '@nestjs/common';
import { UserDepartmentRolService } from './user-department-rol.service';

export class IDeleteUserDepartmentRolDto {
  departmentId: string;
  userId: string;
}

@Controller('user-department-rol')
export class UserDepartmentRolController {
  constructor(
    private readonly userDepartmentRolService: UserDepartmentRolService,
  ) {}
}
