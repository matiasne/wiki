import { OpenAI } from 'langchain/llms/openai';
import { loadSummarizationChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as fs from 'fs';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Global, Injectable } from '@nestjs/common';

@Global()
@Injectable()
export class SummarizeDocService {
  constructor() {}

  async getSummary(doc) {
    const model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.1,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const chain = loadSummarizationChain(model, { type: 'map_reduce' });

    /*  const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const docs = await textSplitter.createDocuments([text]);*/

    console.log('waiting summary');
    const res = await chain.call({
      input_documents: doc,
    });

    console.log('====================================');
    console.log('Summary: ');
    console.log({ res });
    console.log('====================================');
  }
}
