import { Injectable } from '@nestjs/common';
import {
  CreateUserNodeRoleDto,
  EnumNodeRoles,
} from './dto/create-user-node-rol.dto';
import { UpdateUserNodeRoleDto } from './dto/update-user-node-rol.dto';
import { User } from 'src/users/entities/users.entity';
import { ContentNode } from 'src/content-node/entities/content-node.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserNodeRole } from './entities/user-node-rol.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserNodeRoleService {
  constructor(
    @InjectRepository(UserNodeRole)
    private readonly userNodeRoleRepository: Repository<UserNodeRole>,
  ) {}

  create(createUserNodeRolDto: CreateUserNodeRoleDto) {
    let newRol = this.userNodeRoleRepository.create(createUserNodeRolDto);
    this.userNodeRoleRepository.save(newRol);
  }

  findAll() {
    return `This action returns all userNodeRol`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userNodeRol`;
  }

  update(id: number, updateUserNodeRolDto: UpdateUserNodeRoleDto) {
    return `This action updates a #${id} userNodeRol`;
  }

  async remove(id: number) {
    return await this.userNodeRoleRepository.delete(id);
  }

  async addUserAsCreator(user: User, node: ContentNode) {
    const newUserNodeRoleDTO: CreateUserNodeRoleDto = {
      role: EnumNodeRoles.CREATOR,
      node: node,
      user: user,
    };

    this.create(newUserNodeRoleDTO);
  }
}
