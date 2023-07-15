import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatterBox } from './entities/chatterbox.entity';
import { ChatterboxController } from './chatterbox.controller';
import { ChatterboxService } from './chatterbox.service';
import { ContentNodeModule } from 'src/content-node/content-node.module';
import { LangChainService } from 'src/services/langchain.service';
import { OpenAIModule } from 'src/openai/openai.module';
import { PinecodeApiService } from 'src/services/pinecode.service';
import { IngestDataService } from 'src/services/ingest-data.service';
import { OpenAIService } from 'src/openai/openai.service';
import { ConversationsService } from './conversations.service';
import { Conversation } from 'src/chatterbox/entities/conversation.entity';
import { ConversationMessage } from './entities/conversation-message.entity';
import { UsersModule } from 'src/users/users.module';
import { ConversationsMessagesService } from './conversations-messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatterBox]),
    TypeOrmModule.forFeature([Conversation]),
    TypeOrmModule.forFeature([ConversationMessage]),
    ContentNodeModule,
    OpenAIModule,
    UsersModule,
  ],
  controllers: [ChatterboxController],
  providers: [
    ChatterboxService,
    ConversationsService,
    ConversationsMessagesService,
    LangChainService,
    PinecodeApiService,
    OpenAIService,
    IngestDataService,
  ],
  exports: [ChatterboxService, ConversationsService],
})
export class ChatterboxModule {}
