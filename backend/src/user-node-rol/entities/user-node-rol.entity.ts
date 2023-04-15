import { Department } from 'src/departments/entities/department.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { EnumNodeRoles } from '../dto/create-user-node-rol.dto';
import { ContentNode } from 'src/content-node/entities/content-node.entity';
import { BaseEntity } from 'src/shared/base.entity';

@Entity('user-node-rol')
export class UserNodeRole extends BaseEntity {
  @Column({ default: EnumNodeRoles.VIEWER })
  role: EnumNodeRoles;

  @ManyToOne(() => ContentNode, (node) => node.usersRoles, {
    onDelete: 'CASCADE',
  })
  node: ContentNode;

  @ManyToOne(() => User, (user) => user.nodesRoles, {
    onDelete: 'CASCADE',
  })
  user: User;
}
