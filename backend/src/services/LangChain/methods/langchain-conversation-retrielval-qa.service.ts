import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { Global, Injectable } from '@nestjs/common';
import { ChainValues, LLMResult } from 'langchain/dist/schema';
import { RelevantsDocumentsService } from '../relevants-documents.service';

@Global()
@Injectable()
export class LangChainConversationRetrievalQAService {
  constructor(private relevantsDocumentsService: RelevantsDocumentsService) {}

  public async chainCall(
    question: string,
    chatterboxId: string,
  ): Promise<ChainValues> {
    return new Promise(async (resolve, reject) => {
      let vectorStore = await this.relevantsDocumentsService.getVectorStore(
        chatterboxId,
      );

      const chain = ConversationalRetrievalQAChain.fromLLM(
        new ChatOpenAI({
          modelName: 'gpt-4',
          temperature: 0.9,
          openAIApiKey: process.env.OPENAI_API_KEY,
        }),
        vectorStore.asRetriever(),
        {
          returnSourceDocuments: true,
        },
      );

      console.log(chain.questionGeneratorChain);

      let response = await chain.call({
        question,
        chat_history: [],
      });

      resolve(response);
    });
  }
}
