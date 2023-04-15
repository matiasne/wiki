import { Department } from 'src/departments/entities/department.entity';
import { Rol } from 'src/user-department-rol/dto/create-user-department-rol.dto';
import { User } from 'src/users/entities/users.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvitationStatus } from '../dto/create-invitation.dto';

@Entity('invitation')
export class Invitation extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ default: '' })
  rol: Rol;

  @Column({ default: '' })
  status: InvitationStatus;

  @Column({ default: '' })
  expirationDate: string;

  @Column({ default: '' })
  userReceivingEmail: string;

  @ManyToOne(() => Department, (department) => department.invitations, {
    onDelete: 'CASCADE',
  })
  department: Department;

  @ManyToOne(() => User, (user) => user.invitationsReceived, {
    onDelete: 'CASCADE',
  })
  userReceiving: User;

  @ManyToOne(() => User, (user) => user.invitationsSent, {
    onDelete: 'CASCADE',
  })
  userSender: User;
}
