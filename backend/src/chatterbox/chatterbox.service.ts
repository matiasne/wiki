import { Injectable } from '@nestjs/common';
import { ChatterBox } from './entities/chatterbox.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatterboxDto } from './dto/create-chatterbox.dto';
import { UpdateChatterboxDto } from './dto/update-chatterbox.dto';
import { ContentNodeService } from 'src/content-node/content-node.service';
import {
  CreateContentNodeDto,
  EnumContentNodeType,
} from 'src/content-node/dto/create-content-node.dto';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { UpdateContentNodeDto } from 'src/content-node/dto/update-content-node.dto';
import { ChatDto } from './dto/chat.dto';
import { UsersService } from 'src/users/users.service';
import { ConversationMessage } from './entities/conversation-message.entity';
import { ConversationsMessagesService } from './conversations-messages.service';
import { LangChainService } from 'src/services/langchain.service';

@Injectable()
export class ChatterboxService {
  constructor(
    @InjectRepository(ChatterBox)
    private readonly chatterboxRepository: Repository<ChatterBox>,
    private contentNodeService: ContentNodeService,
    private usersService: UsersService,
    private conversationMessageService: ConversationsMessagesService,
    private langChainService: LangChainService,
  ) {}

  async create(user: any, createChatterboxDto: CreateChatterboxDto) {
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

    console.log('createContentNode', createContentNode);
    let node = await this.contentNodeService.create(user, createContentNode);

    let chatterbox = await this.chatterboxRepository.create(
      createChatterboxDto,
    );

    chatterbox.id = node.id; //ver si no debo hacer con una relación

    this.chatterboxRepository.save(chatterbox);

    console.log('chatterbox', chatterbox);
    return chatterbox;
  }

  async findById(user: IAuthUser, chatterboxId: string) {
    return await this.chatterboxRepository.findOne({
      where: {
        id: chatterboxId,
      },
    });
  }

  async update(
    user: IAuthUser,
    id: string,
    updateChatterboxDto: UpdateChatterboxDto,
  ) {
    console.log('id', id);
    console.log('updateChatterboxDto', updateChatterboxDto);

    await this.contentNodeService.update(
      user,
      id,
      updateChatterboxDto as UpdateContentNodeDto,
    );

    return await this.chatterboxRepository.update(id, updateChatterboxDto);
  }

  async remove(user, id: string) {
    this.contentNodeService.remove(user, id);
    return await this.chatterboxRepository.delete(id);
  }

  async processMessage(user: IAuthUser, chatDto: ChatDto) {
    const owner = await this.usersService.getById(user.id);

    const node = await this.contentNodeService.findOne(
      user,
      chatDto.nodeId ? chatDto.nodeId : chatDto.chatterboxId,
    );

    let newUserMessage: ConversationMessage = new ConversationMessage();

    newUserMessage.user = owner;
    newUserMessage.node = node;
    newUserMessage.userMessage = true;
    newUserMessage.data = chatDto.message;

    this.conversationMessageService.create(newUserMessage);

    let newBackMessage: ConversationMessage = new ConversationMessage();

    let response = await this.langChainService.respondToQuestion(chatDto);

    newBackMessage.user = owner;
    newBackMessage.node = node;
    newBackMessage.userMessage = false;
    newBackMessage.data = response.text;

    this.conversationMessageService.create(newBackMessage);

    return {
      chatterboxId: chatDto.nodeId,
      text: response.text,
      sourceDocuments: response.sourceDocuments,
    };
  }
}
