import { BaseEntity } from 'src/shared/base.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ContentNode } from 'src/content-node/entities/content-node.entity';

@Entity('comment')
export class Comment extends BaseEntity {
  @Column({ default: '' })
  content: string;

  @ManyToOne(() => ContentNode, (contentNode) => contentNode.comments, {
    onDelete: 'CASCADE',
  })
  contentNode: ContentNode;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  userCreator: User;

  /* @ManyToOne(() => DocumentText, (document) => document.comments, {
    onDelete: 'CASCADE',
  })
  document: Document;*/
}
