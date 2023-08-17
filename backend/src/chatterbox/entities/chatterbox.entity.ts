import { BaseEntity } from 'src/shared/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ConversationMessage } from './conversation-message.entity';
import { IsNumber } from 'class-validator';

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

  @Column({ default: '' })
  temperature: string;

  @Column({ default: '' })
  textChunkSize: string;

  @Column({ default: '' })
  textOverlapSize: string;
}
