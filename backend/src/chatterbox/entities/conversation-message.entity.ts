import { BaseEntity } from 'src/shared/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Conversation } from 'src/chatterbox/entities/conversation.entity';

@Entity('conversation-message')
export class ConversationMessage extends BaseEntity {
  @Column({ default: '' })
  data: string;

  @Column({ default: false })
  userMessage: boolean;

  @ManyToOne((type) => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;
}
