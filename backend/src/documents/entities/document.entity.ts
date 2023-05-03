import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/shared/base.entity';

@Entity('document')
export class DocumentText extends BaseEntity {
  @Column({ default: '' })
  nodeId: string;

  @Column({ default: '' })
  data: string;
}
