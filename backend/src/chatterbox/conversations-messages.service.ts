import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationMessage } from './entities/conversation-message.entity';

@Injectable()
export class ConversationsMessagesService {
  constructor(
    @InjectRepository(ConversationMessage)
    private readonly conversationRepository: Repository<ConversationMessage>,
  ) {}

  create(conversationMessage: ConversationMessage) {
    // let cm = this.conversationRepository.create(conversationMessage);
    this.conversationRepository.save(conversationMessage);
  }

  getMessagesByConversationId(conversationId: string, page: number) {
    return this.conversationRepository.find({
      where: {
        id: conversationId,
      },
      skip: (page - 1) * 10,
      take: 10,
    });
  }
}
