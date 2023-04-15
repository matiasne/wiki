import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDepartmentRolDto } from './create-user-department-rol.dto';

export class UpdateUserDepartmentRolDto extends PartialType(
  CreateUserDepartmentRolDto,
) {}
