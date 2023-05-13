import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/shared/base.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Entity('document')
export class DocumentText extends BaseEntity {
  @Column({ default: '' })
  nodeId: string;

  @Column({ default: '' })
  data: string;
  /*
  @OneToMany((type) => Comment, (comment) => comment.document)
  comments: Comment[];*/
}
