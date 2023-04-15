import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ContentNodeService } from 'src/content-node/content-node.service';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { UpdateContentNodeDto } from 'src/content-node/dto/update-content-node.dto';
import { Document } from './entities/document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentUserCursorsRepository: Repository<Document>,
    private contentNodeService: ContentNodeService,
  ) {}
  async upload(
    createDocumentDto: CreateDocumentDto,
    file: any,
    user: IAuthUser,
  ) {
    const node = await this.contentNodeService.findOne(
      user,
      createDocumentDto.nodeId,
    );

    if (node) {
      const updateNode: UpdateContentNodeDto = {
        data: file.filename,
      };

      await this.contentNodeService.update(user, node.id, updateNode);
    }
  }

  create(user: IAuthUser, createDocumentDto: CreateDocumentDto) {
    this.documentUserCursorsRepository.create(createDocumentDto);
  }

  findAll() {
    return `This action returns all documents`;
  }

  findOne(id: string) {
    this.documentUserCursorsRepository.findOne({ where: { id: id } });
  }

  update(id: string, updateDocumentDto: UpdateDocumentDto) {
    this.documentUserCursorsRepository.update(id, updateDocumentDto);
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
