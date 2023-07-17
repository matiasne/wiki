import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  ConversationalRetrievalQAChain,
  LLMChain,
  loadQAChain,
  loadQARefineChain,
} from 'langchain/chains';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { Global, Injectable } from '@nestjs/common';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChatDto } from 'src/chatterbox/dto/chat.dto';
import { ChainValues, LLMResult } from 'langchain/dist/schema';
import { PromptTemplate } from 'langchain';
import { PinecodeApiService } from '../pinecode.service';

@Global()
@Injectable()
export class RelevantsDocumentsService {
  constructor(private pinecodeApiService: PinecodeApiService) {}

  async usingRefineDocumentsChain(
    question: string,
    chatterboxId: string,
    nodeIdDocument: string = null,
  ): Promise<ChainValues> {
    return new Promise(async (resolve, reject) => {
      question = question.trim().replace(/\n./g, ' ');

      const index = await this.pinecodeApiService.getIndex();

      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        { pineconeIndex: index, namespace: chatterboxId },
      );

      let filter = {};
      if (nodeIdDocument) {
        filter = {
          nodeId: nodeIdDocument,
        };
      }

      const results = await vectorStore.similaritySearch(question, 1, filter);

      resolve(results);
    });
  }

  getVectorStore(chatterboxId: string): Promise<PineconeStore> {
    return new Promise(async (resolve, reject) => {
      const index = await this.pinecodeApiService.getIndex();

      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        { pineconeIndex: index, namespace: chatterboxId },
      );

      resolve(vectorStore);
    });
  }
}
