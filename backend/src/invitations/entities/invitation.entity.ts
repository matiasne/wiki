import { User } from 'src/users/entities/users.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvitationStatus } from '../dto/create-invitation.dto';
import { ContentNode } from 'src/content-node/entities/content-node.entity';
import { EnumNodeRoles } from 'src/user-node-rol/dto/create-user-node-rol.dto';

@Entity('invitation')
export class Invitation extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ default: '' })
  role: EnumNodeRoles;

  @Column({ default: '' })
  status: InvitationStatus;

  @Column({ default: '' })
  expirationDate: string;

  @Column({ default: '' })
  userReceivingEmail: string;

  @ManyToOne(() => ContentNode, (node) => node.invitations, {
    onDelete: 'CASCADE',
  })
  node: ContentNode;

  @ManyToOne(() => User, (user) => user.invitationsReceived, {
    onDelete: 'CASCADE',
  })
  userReceiving: User;

  @ManyToOne(() => User, (user) => user.invitationsSent, {
    onDelete: 'CASCADE',
  })
  userSender: User;
}
