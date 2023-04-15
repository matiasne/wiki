import { Department } from 'src/departments/entities/department.entity';
import { User } from 'src/users/entities/users.entity';

export enum Rol {
  OWNER = 'OWNER',
  COOWNER = 'COOWNER',
  VIEWER = 'VIEWER',
  INHERITEDVIEWER = 'INHERITEDVIEWER',
}

export class CreateUserDepartmentRolDto {
  rol: Rol;
  department: Department;
  user: User;
}
