import { ChatterBox } from 'src/chatterbox/entities/chatterbox.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { DocumentText } from 'src/documents/entities/document.entity';

@Entity('comment')
export class Comment extends BaseEntity {
  @Column({ default: '' })
  content: string;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  userCreator: User;

  @ManyToOne(() => ChatterBox, (chatterbox) => chatterbox.comments, {
    onDelete: 'CASCADE',
  })
  chatterbox: ChatterBox;

  /* @ManyToOne(() => DocumentText, (document) => document.comments, {
    onDelete: 'CASCADE',
  })
  document: Document;*/
}
