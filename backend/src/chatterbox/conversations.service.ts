import { Injectable } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { UsersService } from 'src/users/users.service';
import { ChatterBox } from './entities/chatterbox.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private usersService: UsersService,
  ) {}

  async findById(id: string) {
    return await this.conversationRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async create(user: IAuthUser, chatterbox: ChatterBox) {
    const owner = await this.usersService.getById(user.id);

    const newConversation: Conversation = this.conversationRepository.create();

    newConversation.user = owner;
    newConversation.chatterbox = chatterbox;

    console.log('newConversation', newConversation);

    return await this.conversationRepository.save(newConversation);
  }

  async remove(id: string) {
    return await this.conversationRepository.delete(id);
  }
}
