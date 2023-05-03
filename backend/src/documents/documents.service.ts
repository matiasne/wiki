import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ContentNodeService } from 'src/content-node/content-node.service';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { DocumentText } from './entities/document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContentNodeDto } from 'src/content-node/dto/create-content-node.dto';
import { EnumContentNodeType } from 'src/content-node/dto/create-content-node.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import {
  EnumLangchainFilesType,
  emojiUnifiedMap,
} from 'src/shared/enum.langchain-files-types';
import { extname } from 'path';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentText)
    private readonly documentUserCursorsRepository: Repository<DocumentText>,
    private contentNodeService: ContentNodeService,
  ) {}
  async upload(uploadFileDto: UploadFileDto, file: any, user: IAuthUser) {
    let ext: any = extname(file.originalname);
    let isAvailable = Object.values(EnumLangchainFilesType).includes(ext);

    console.log(isAvailable);

    if (!isAvailable) {
      return {
        message: 'File type not allowed',
      };
    }

    const parentNode = await this.contentNodeService.findOne(
      user,
      uploadFileDto.parentId,
    );

    if (parentNode) {
      const createContentNode: CreateContentNodeDto = {
        parentId: uploadFileDto.parentId,
        emojiUnified: emojiUnifiedMap[ext],
        data: file.filename,
        name: file.originalname,
        description: '',
        type: EnumContentNodeType.FILE,
        extension: ext,
      };

      return await this.contentNodeService.create(user, createContentNode);

      //   await this.contentNodeService.update(user, node.id, updateNode);
    }
  }

  create(user: IAuthUser, createDocumentDto: CreateDocumentDto) {
    this.documentUserCursorsRepository.create(createDocumentDto);
  }

  findAll() {
    return `This action returns all documents`;
  }

  findByNodeId(id: string) {
    this.documentUserCursorsRepository.findOne({ where: { id: id } });
  }

  update(id: string, updateDocumentDto: UpdateDocumentDto) {
    this.documentUserCursorsRepository.update(id, updateDocumentDto);
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
