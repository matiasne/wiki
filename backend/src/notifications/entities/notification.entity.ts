import { InvitationStatus } from 'aws-sdk/clients/managedblockchain';
import { User } from 'src/users/entities/users.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EnumNotificationType } from '../dto/create-notification.dto';

@Entity('notification')
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ default: '' })
  status: InvitationStatus;

  @Column({ default: '' })
  message: string;

  @Column({ default: '' })
  typeRefUID: string;

  @Column({ default: '' })
  type: EnumNotificationType;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  user: User;
}
