import { ChatOpenAI } from 'langchain/chat_models/openai';
//import { createTaggingChain } from 'langchain/chains';
import { Global, Injectable } from '@nestjs/common';
import { ChainValues, LLMResult } from 'langchain/dist/schema';
import { RelevantsDocumentsService } from '../relevants-documents.service';
@Global()
@Injectable()
export class LangChainTaggingService {
  constructor(private relevantsDocumentsService: RelevantsDocumentsService) {}

  async usingRefineDocumentsChain(question: string): Promise<ChainValues> {
    return new Promise(async (resolve, reject) => {
      let schema = {
        type: 'object',
        properties: {
          sentiment: { type: 'string' },
          tone: { type: 'string' },
          language: { type: 'string' },
        },
        required: ['tone'],
      };

      const chatModel = new ChatOpenAI({
        modelName: 'gpt-4-0613',
        temperature: 0,
      });

      //const chain = createTaggingChain(schema, chatModel);

      /*console.log(
        await chain.run(
          `Estoy increiblemente contento de haberte conocido! Creo que seremos muy buenos amigos!`,
        ),
      );*/
    });
  }
}
