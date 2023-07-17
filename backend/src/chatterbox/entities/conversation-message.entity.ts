import { BaseEntity } from 'src/shared/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { ChatterBox } from './chatterbox.entity';
import { ContentNode } from 'src/content-node/entities/content-node.entity';

@Entity('conversation-message')
export class ConversationMessage extends BaseEntity {
  @Column({ default: '' })
  data: string;

  @Column({ default: false })
  userMessage: boolean;

  @ManyToOne(() => User, (user) => user.messages, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => ContentNode, (node) => node.messages, {
    onDelete: 'CASCADE',
  })
  node: ContentNode;
}
