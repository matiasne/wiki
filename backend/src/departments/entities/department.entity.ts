import { Invitation } from 'src/invitations/entities/invitation.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { UserDepartmentRol } from 'src/user-department-rol/entities/user-department-rol.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('department')
export class Department extends BaseEntity {
  @Column({ default: '' })
  name: string;

  @OneToMany(
    (type) => UserDepartmentRol,
    (UserDepartmentRol) => UserDepartmentRol.department,
  )
  usersRoles: UserDepartmentRol[];

  @ManyToOne((type) => Department, (department) => department.children, {
    onDelete: 'CASCADE',
  })
  parent: Department;

  @OneToMany((type) => Department, (department) => department.parent)
  children: Department[];

  @OneToMany((type) => Invitation, (Invitation) => Invitation.department)
  invitations: Invitation[];
}
