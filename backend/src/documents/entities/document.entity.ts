import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/shared/base.entity';

@Entity('document')
export class Document extends BaseEntity {
  @Column({ default: '' })
  data: string;
}
