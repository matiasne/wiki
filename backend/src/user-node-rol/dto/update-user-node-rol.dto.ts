import { PartialType } from '@nestjs/mapped-types';
import { CreateUserNodeRoleDto } from './create-user-node-rol.dto';

export class UpdateUserNodeRoleDto extends PartialType(CreateUserNodeRoleDto) {}
