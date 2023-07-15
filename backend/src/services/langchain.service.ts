import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  ConversationalRetrievalQAChain,
  LLMChain,
  loadQAChain,
} from 'langchain/chains';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PromptTemplate } from 'langchain/prompts';
import { CallbackManager } from 'langchain/callbacks';
import { Global, Injectable } from '@nestjs/common';
import { PinecodeApiService } from './pinecode.service';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChatDto } from 'src/chatterbox/dto/chat.dto';
import { ChainValues, LLMResult } from 'langchain/dist/schema';

@Global()
@Injectable()
export class LangChainService {
  constructor(private pinecodeApiService: PinecodeApiService) {}

  async respondToQuestion(chatDto: ChatDto): Promise<ChainValues> {
    return new Promise(async (resolve, reject) => {
      const question = chatDto.message.trim().replace(/\n./g, ' ');

      const index = await this.pinecodeApiService.getIndex();

      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        { pineconeIndex: index, namespace: chatDto.chatterboxId },
      );

      let history = []; // chatDto.history;

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

      console.log(chain);

      let response = await chain.call({
        question,
        chat_history: history || [],
      });

      resolve(response);
    });
  }
  /*
  private questionGenerator() {
    return new LLMChain({
      llm: new ChatOpenAI({
        temperature: 0.9,
        openAIApiKey: process.env.OPENAI_API_KEY,
      }),
      prompt: this.getCondensedPrompt(),
    });
  }

  private docChain(onTokenStream: (token: string) => void) {
    let s = '';
    const callbackManager = CallbackManager.fromHandlers({
      async handleLLMNewToken(token: string) {
        s += token;
      },

      async handleLLMEnd(output: LLMResult) {
        onTokenStream(output.generations[0][0].text);
      },
      async handleLLMStart(llm, _prompts: string[]) {
        console.log('handleLLMStart', { llm });
      },
      async handleChainStart(chain) {
        console.log('handleChainStart', { chain });
      },
      async handleChainEnd(chain) {
        console.log('handleChainEnd', { chain });
      },
      async handleAgentAction(action) {
        console.log('handleAgentAction', action);
      },
      async handleToolStart(tool) {
        console.log('handleToolStart', { tool });
      },
    });

    let qaChain = loadQAChain(
      new ChatOpenAI({
        temperature: 0,
        streaming: true,
        callbackManager: callbackManager,
        openAIApiKey: process.env.OPENAI_API_KEY,
      }),
      { prompt: this.getQAprompt() },
    );

    return qaChain;
  }*/
  /*
  private getCondensedPrompt() {
    return PromptTemplate.fromTemplate(`
    Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);
  }

  private getQAprompt() {
    return PromptTemplate.fromTemplate(
      `You are an AI assistant providing helpful advice. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
      If you can't find the answer in the context below just say "Hmm, I'm not sure." Don't try to make up an answer.
      If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
      You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks.
  Question: {question}
  =========
  {context}
  =========
  Answer in Markdown:`,
    );
  }*/
}
