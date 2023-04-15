import { ContentNode } from 'src/content-node/entities/content-node.entity';
import { User } from 'src/users/entities/users.entity';

export enum EnumNodeRoles {
  CREATOR = 'CREATOR',
  OWNER = 'OWNER',
  COOWNER = 'COOWNER',
  VIEWER = 'VIEWER',
  INHERITEDVIEWER = 'INHERITEDVIEWER',
}

export class CreateUserNodeRoleDto {
  role: EnumNodeRoles;
  node: ContentNode;
  user: User;
}
