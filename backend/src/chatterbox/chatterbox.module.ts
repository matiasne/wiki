import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatterBox } from './entities/chatterbox.entity';
import { ChatterboxController } from './chatterbox.controller';
import { ChatterboxService } from './chatterbox.service';
import { ContentNodeModule } from 'src/content-node/content-node.module';
import { LangChainService } from 'src/services/langchain.service';
import { OpenAIModule } from 'src/openai/openai.module';
import { PinecodeApiService } from 'src/services/pinecode.service';
import { OpenAIService } from 'src/openai/openai.service';
import { ConversationMessage } from './entities/conversation-message.entity';
import { UsersModule } from 'src/users/users.module';
import { ConversationsMessagesService } from './conversations-messages.service';
import { LangChainConversationRetrievalQAService } from 'src/services/LangChain/methods/langchain-conversation-retrielval-qa.service';
import { RelevantsDocumentsService } from 'src/services/LangChain/relevants-documents.service';
import { LangChainDocumentsQAService } from 'src/services/LangChain/methods/langchain-documentqa.service';
import { SummarizeDocService } from 'src/services/summary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatterBox]),
    TypeOrmModule.forFeature([ConversationMessage]),
    ContentNodeModule,
    OpenAIModule,
    UsersModule,
  ],
  controllers: [ChatterboxController],
  providers: [
    ChatterboxService,
    ConversationsMessagesService,
    LangChainService,
    SummarizeDocService,
    LangChainConversationRetrievalQAService,
    RelevantsDocumentsService,
    LangChainDocumentsQAService,
    PinecodeApiService,
    OpenAIService,
  ],
  exports: [ChatterboxService],
})
export class ChatterboxModule {}
