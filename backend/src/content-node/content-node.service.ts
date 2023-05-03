import { Injectable } from '@nestjs/common';
import { CreateContentNodeDto } from './dto/create-content-node.dto';
import { UpdateContentNodeDto } from './dto/update-content-node.dto';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentNode } from './entities/content-node.entity';
import { IsNull, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { UserNodeRoleService } from 'src/user-node-rol/user-node-rol.service';

@Injectable()
export class ContentNodeService {
  constructor(
    @InjectRepository(ContentNode)
    private readonly contentNodeRepository: Repository<ContentNode>,
    private usersService: UsersService,
    private userNodeRolService: UserNodeRoleService,
  ) {}

  async create(user: IAuthUser, createContentNodeDto: CreateContentNodeDto) {
    console.log(createContentNodeDto);

    const creator = await this.usersService.getById(user.id);

    if (await this.checkIfNodeNameExists(user, createContentNodeDto)) {
      return {
        message: 'Node with this name already exists',
      };
    }

    const newNode: ContentNode =
      this.contentNodeRepository.create(createContentNodeDto);

    if (createContentNodeDto.parentId != '0') {
      const parentNode = await this.findOne(
        user,
        createContentNodeDto.parentId,
      );

      if (parentNode == null) {
        return {
          message: 'Parent node not found or user does not have access to it',
        };
      }
      newNode.parent = parentNode;
    }

    let node: ContentNode = await this.contentNodeRepository.save(newNode);

    this.userNodeRolService.addUserAsCreator(creator, node);

    return node;
  }

  async findRoots(user: IAuthUser) {
    const parameters = {
      userId: user.id,
    };

    const data = await this.contentNodeRepository
      .createQueryBuilder('contentNode')
      .leftJoinAndSelect('contentNode.usersRoles', 'userNodeRole')
      .leftJoinAndSelect('userNodeRole.user', 'user')
      .where('contentNode.parentId IS NULL')
      .andWhere('user.id = :userId')
      .setParameters(parameters)
      .getMany();

    return data;
  }

  async findRootId(user: IAuthUser, id: string) {
    const parameters = {
      id: id,
      userId: user.id,
    };

    const data = await this.contentNodeRepository
      .createQueryBuilder('contentNode')
      .leftJoinAndSelect('contentNode.usersRoles', 'userNodeRole')
      .leftJoinAndSelect('userNodeRole.user', 'user')
      .where('contentNode.id = :id')
      .where('contentNode.parentId IS NULL')
      .andWhere('user.id = :userId')
      .setParameters(parameters)
      .getMany();

    return data;
  }

  async findDescendantsTree(user: IAuthUser, id: string) {
    const parameters = {
      userId: user.id,
    };

    let node = await this.contentNodeRepository.findOne({ where: { id: id } });

    return await this.contentNodeRepository.manager
      .getTreeRepository(ContentNode)
      .findDescendantsTree(node);
    // returns all direct subcategories (without its nested categories) of a parentCategory
  }

  async findOne(user: IAuthUser, id: string) {
    const parameters = {
      userId: user.id,
      id: id,
    };

    return await this.contentNodeRepository
      .createQueryBuilder('contentNode')
      .leftJoinAndSelect('contentNode.usersRoles', 'userNodeRole')
      .leftJoinAndSelect('userNodeRole.user', 'user')
      .where('contentNode.id = :id')
      .andWhere('user.id = :userId')
      .setParameters(parameters)
      .getOne();
  }

  async findAll(user: IAuthUser) {
    const parameters = {
      userId: user.id,
    };

    return await this.contentNodeRepository
      .createQueryBuilder('contentNode')
      .leftJoinAndSelect('contentNode.usersRoles', 'userNodeRole')
      .leftJoinAndSelect('userNodeRole.user', 'user')
      .andWhere('user.id = :userId')
      .setParameters(parameters)
      .getMany();
  }

  async update(
    user: IAuthUser,
    id: string,
    updateContentNodeDto: UpdateContentNodeDto,
  ) {
    if (await this.checkIfNodeNameExists(user, updateContentNodeDto)) {
      return {
        message: 'Node with this name already exists',
      };
    }

    let node: ContentNode = await this.findOne(user, id);
    if (node == null) {
      return {
        message: 'Node not found or user does not have access to it',
      };
    }

    let partialNode: ContentNode = new ContentNode();
    partialNode.description = updateContentNodeDto.description;
    partialNode.name = updateContentNodeDto.name;

    if (updateContentNodeDto.parentId != '0') {
      let parent: ContentNode = await this.findOne(
        user,
        updateContentNodeDto.parentId,
      );
      partialNode.parent = parent;
    }

    partialNode.emojiUnified = updateContentNodeDto.emojiUnified;
    partialNode.type = updateContentNodeDto.type;
    partialNode.data = updateContentNodeDto.data;

    return await this.contentNodeRepository.update(id, partialNode);
  }

  async remove(user: IAuthUser, id: string) {
    let node: ContentNode = await this.findOne(user, id);
    if (node == null) {
      return {
        message: 'Node not found or user does not have access to it',
      };
    }
    try {
      return await this.contentNodeRepository.delete(node.id);
    } catch (e) {
      console.log(e);
      return {
        message:
          'Node could not be deleted the node does not exist or has children',
      };
    }
  }

  async checkIfNodeNameExists(
    user: IAuthUser,
    contentNodeDto: CreateContentNodeDto | UpdateContentNodeDto,
  ) {
    let nodeDescendants: any;

    if (contentNodeDto.parentId != '0') {
      nodeDescendants = await this.findDescendantsTree(
        user,
        contentNodeDto.parentId,
      );

      let exist = await nodeDescendants.childrens.find(
        (element) => element.name == contentNodeDto.name,
      );
      if (exist) {
        return true;
      }
    } else {
      nodeDescendants = await this.findRoots(user);

      let exist = await nodeDescendants.find(
        (element) => element.name == contentNodeDto.name,
      );
      console.log(exist);
      if (exist) {
        return true;
      }
    }
    return false;
  }
}
