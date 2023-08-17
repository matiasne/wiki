import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateContentNodeDto,
  EnumContentNodeType,
} from './dto/create-content-node.dto';
import { UpdateContentNodeDto } from './dto/update-content-node.dto';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentNode } from './entities/content-node.entity';
import { IsNull, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { UserNodeRoleService } from 'src/user-node-rol/user-node-rol.service';
import { PinecodeApiService } from 'src/services/pinecode.service';
import { DocumentsService } from 'src/documents/documents.service';
import { CustomException } from 'src/shared/custom-http-exception';
import { IngestDataService } from 'src/services/ingest-data.service';
import { ChatterboxService } from 'src/chatterbox/chatterbox.service';

@Injectable()
export class ContentNodeService {
  constructor(
    @InjectRepository(ContentNode)
    private readonly contentNodeRepository: Repository<ContentNode>,
    private usersService: UsersService,
    private userNodeRolService: UserNodeRoleService,
    private pinecodeApiService: PinecodeApiService,
    private ingestService: IngestDataService,
  ) {}

  async create(user: IAuthUser, createContentNodeDto: CreateContentNodeDto) {
    const creator = await this.usersService.getById(user.id);

    if (await this.checkIfNodeNameExists(user, createContentNodeDto)) {
      throw new CustomException(
        'Node name already exists',
        HttpStatus.CONFLICT,
      );
    }

    const newNode: ContentNode =
      this.contentNodeRepository.create(createContentNodeDto);

    if (createContentNodeDto.parentId != '0') {
      const parentNode = await this.findOne(
        user,
        createContentNodeDto.parentId,
      );

      if (parentNode == null) {
        return null;
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

  async findDescendantsTree(
    user: IAuthUser,
    id: string,
  ): Promise<ContentNode[]> {
    let node = await this.contentNodeRepository.findOne({ where: { id: id } });

    let nodeData: ContentNode = await this.contentNodeRepository.manager
      .getTreeRepository(ContentNode)
      .findDescendantsTree(node);

    return nodeData.childrens;
  }

  async findParentTree(id: string) {
    let node = await this.contentNodeRepository.findOne({ where: { id: id } });

    let res = await this.contentNodeRepository.manager
      .getTreeRepository(ContentNode)
      .findAncestors(node);

    return res[0]; //el primero es el nodo mismo no se poruqe es así
  }

  async findChattrebocOfNodeTree(id: string) {
    let node = await this.contentNodeRepository.findOne({ where: { id: id } });

    let res = await this.contentNodeRepository.manager
      .getTreeRepository(ContentNode)
      .findAncestors(node);

    return res.find((r) => r.type == EnumContentNodeType.CHATTERBOX); //el primero es el nodo mismo no se poruqe es así
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

    let parentNode = await this.findParentTree(node.id);

    if (node == null) {
      return {
        message: 'Node not found or user does not have access to it',
      };
    }

    return this.removeTreeNode(user, node, parentNode ? parentNode.id : '0');
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

      let exist = await nodeDescendants.find(
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

      if (exist) {
        return true;
      }
    }
    return false;
  }

  private async removeTreeNode(user, node: ContentNode, parentNodeId: string) {
    if (
      node.type == EnumContentNodeType.FOLDER ||
      node.type == EnumContentNodeType.CHATTERBOX
    ) {
      let childrens = await this.findDescendantsTree(user, node.id);
      for await (let children of childrens) {
        await this.removeTreeNode(user, children, node.id);
      }
    }
    return this.removeAllAboutNode(node, parentNodeId);
  }

  private async removeAllAboutNode(node: ContentNode, parentNodeId: string) {
    let source = node.data;

    try {
      if (node.type == EnumContentNodeType.FILE) {
        var fs = require('fs');
        var filePath = __dirname + '/../../uploads/' + node.data;
        fs.unlinkSync(filePath);
        source = './uploads/' + node.data;
      }
    } catch (e) {
      //throw e;
    }

    if (
      node.type != EnumContentNodeType.CHATTERBOX &&
      node.type != EnumContentNodeType.FOLDER
    ) {
      let chattreboxNode = await this.findChattrebocOfNodeTree(node.id);
      await this.pinecodeApiService.deleteBySource(chattreboxNode.id, source);
    }

    return await this.contentNodeRepository.delete(node.id);
  }
}
