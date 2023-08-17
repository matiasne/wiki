import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationMessage } from './entities/conversation-message.entity';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';

@Injectable()
export class ConversationsMessagesService {
  constructor(
    @InjectRepository(ConversationMessage)
    private readonly conversationMessageRepository: Repository<ConversationMessage>,
  ) {}

  create(conversationMessage: ConversationMessage) {
    // let cm = this.conversationRepository.create(conversationMessage);
    this.conversationMessageRepository.save(conversationMessage);
  }

  async getMessages(user: IAuthUser, nodeId: string, page: number) {
    const parameters = {
      userId: user.id,
      nodeId: nodeId,
      page: page,
    };

    const data = await this.conversationMessageRepository
      .createQueryBuilder('conversation-message')
      .leftJoinAndSelect('conversation-message.user', 'user')
      .leftJoinAndSelect('conversation-message.node', 'content-node')
      .where('user.id = :userId')
      .andWhere('content-node.id = :nodeId')
      .setParameters(parameters)
      .getMany();

    return data;
  }
}
