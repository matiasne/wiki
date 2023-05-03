import { Injectable } from '@nestjs/common';
import { ChatterBox } from './entities/chatterbox.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { UserDepartmentRolService } from 'src/user-department-rol/user-department-rol.service';
import { CreateChatterboxDto } from './dto/create-chatterbox.dto';
import { UpdateChatterboxDto } from './dto/update-chatterbox.dto';
import { ContentNodeService } from 'src/content-node/content-node.service';
import {
  CreateContentNodeDto,
  EnumContentNodeType,
} from 'src/content-node/dto/create-content-node.dto';

@Injectable()
export class ChatterboxService {
  constructor(
    @InjectRepository(ChatterBox)
    private readonly chatterboxRepository: Repository<ChatterBox>,
    private contentNodeService: ContentNodeService,
  ) {}

  async create(user: any, createChatterboxDto: CreateChatterboxDto) {
    console.log('createChatterboxDto', createChatterboxDto);
    const createContentNode: CreateContentNodeDto = {
      parentId: '0',
      emojiUnified: createChatterboxDto.emojiUnified
        ? createChatterboxDto.emojiUnified
        : '1f575-fe0f',
      data: '',
      name: createChatterboxDto.name,
      description: '',
      type: EnumContentNodeType.CHATTERBOX,
    };

    await this.contentNodeService.create(user, createContentNode);

    return await this.chatterboxRepository.create(createChatterboxDto);
  }

  async findByNodeId(nodeId: string) {
    return await this.chatterboxRepository.findOne({
      where: { nodeId: nodeId },
    });
  }

  async update(id: string, updateChatterboxDto: UpdateChatterboxDto) {
    return await this.chatterboxRepository.update(id, updateChatterboxDto);
  }

  async remove(id: string) {
    return await this.chatterboxRepository.delete(id);
  }
}
