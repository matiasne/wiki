import { Invitation } from 'src/invitations/entities/invitation.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { UserDepartmentRol } from 'src/user-department-rol/entities/user-department-rol.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('chatterbox')
export class ChatterBox extends BaseEntity {
  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  nodeId: string;

  @Column({ default: '' })
  aditionalPrompt: string;

  @Column({ default: '' })
  lastProcessDate: string;
}
