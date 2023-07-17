import { Global, Injectable } from '@nestjs/common';
import { PinecodeApiService } from './pinecode.service';
import { ChatDto } from 'src/chatterbox/dto/chat.dto';
import { ChainValues, LLMResult } from 'langchain/dist/schema';
import { LangChainConversationRetrievalQAService } from './LangChain/methods/langchain-conversation-retrielval-qa.service';
import { LangChainDocumentsQAService } from './LangChain/methods/langchain-documentqa.service';

@Global()
@Injectable()
export class LangChainService {
  constructor(
    private langChainConversationRetrievalQAService: LangChainConversationRetrievalQAService,
    private langChainDocumentsQAService: LangChainDocumentsQAService,
  ) {}

  async respondToQuestion(chatDto: ChatDto): Promise<ChainValues> {
    return new Promise(async (resolve, reject) => {
      let response = {};
      if (chatDto.nodeId == '') {
        response = await this.langChainConversationRetrievalQAService.chainCall(
          chatDto.message,
          chatDto.chatterboxId,
        );
      } else {
        response = await this.langChainDocumentsQAService.chainCall(
          chatDto.message,
          chatDto.chatterboxId,
          chatDto.nodeId,
        );
      }

      resolve(response);
    });
  }

  planAndExecuteAgent() {}
}
