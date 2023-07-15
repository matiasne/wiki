import { ChatterBox } from 'src/chatterbox/entities/chatterbox.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DocumentText } from 'src/documents/entities/document.entity';
import { ContentNode } from 'src/content-node/entities/content-node.entity';
import { ConversationMessage } from 'src/chatterbox/entities/conversation-message.entity';

@Entity('conversation')
export class Conversation extends BaseEntity {
  @ManyToOne(() => User, (user) => user.conversations, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => ChatterBox, (chatterbox) => chatterbox.conversations, {
    onDelete: 'CASCADE',
  })
  chatterbox: ChatterBox;

  @OneToMany(
    (type) => ConversationMessage,
    (conversationMessages) => conversationMessages.conversation,
  )
  messages: ConversationMessage[];
}
