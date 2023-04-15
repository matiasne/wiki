import { Department } from 'src/departments/entities/department.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Rol } from '../dto/create-user-department-rol.dto';

@Entity('user-department-rol')
export class UserDepartmentRol extends BaseEntity {
  @Column({ default: 'INVITED' })
  rol: Rol;

  @ManyToOne(() => Department, (dept) => dept.usersRoles, {
    onDelete: 'CASCADE',
  })
  department: Department;

  @ManyToOne(() => User, (user) => user.departmentsRoles, {
    onDelete: 'CASCADE',
  })
  user: User;
}
