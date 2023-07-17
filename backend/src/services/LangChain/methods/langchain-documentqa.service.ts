import { ChatOpenAI } from 'langchain/chat_models/openai';
import { loadQARefineChain } from 'langchain/chains';
import { Global, Injectable } from '@nestjs/common';
import { ChainValues, LLMResult } from 'langchain/dist/schema';
import { RelevantsDocumentsService } from '../relevants-documents.service';

@Global()
@Injectable()
export class LangChainDocumentsQAService {
  constructor(private relevantsDocumentsService: RelevantsDocumentsService) {}

  public async chainCall(
    question: string,
    chatterboxId: string,
    nodeIdDocument: string = null,
  ): Promise<ChainValues> {
    return new Promise(async (resolve, reject) => {
      const docs: ChainValues =
        await this.relevantsDocumentsService.usingRefineDocumentsChain(
          question,
          chatterboxId,
          nodeIdDocument,
        );

      const chain = loadQARefineChain(
        new ChatOpenAI({
          modelName: 'gpt-4',
          temperature: 0.9,
          openAIApiKey: process.env.OPENAI_API_KEY,
        }),
      );

      if (docs.length != 0) {
        const res = await chain.call({
          input_documents: docs,
          question,
        });

        console.log(res);

        resolve({
          text: res.output_text,
          sourceDocuments: docs,
        });
      } else {
        resolve({
          text: 'No se encontraron documentos relevantes',
          documents: [],
        });
      }
    });
  }
}
