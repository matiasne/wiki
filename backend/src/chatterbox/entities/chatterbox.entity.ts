import { Conversation } from 'src/chatterbox/entities/conversation.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('chatterbox')
export class ChatterBox extends BaseEntity {
  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  nodeId: string;

  @Column({ default: '' })
  emojiUnified: string;

  @Column({ default: '' })
  aditionalPrompt: string;

  @Column({ default: '' })
  lastProcessDate: string;

  @OneToMany((type) => Conversation, (comment) => comment.user)
  conversations: Conversation[];
}
