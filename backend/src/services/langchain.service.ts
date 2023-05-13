import { OpenAIChat } from 'langchain/llms';
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
import { PineconeStore } from 'langchain/vectorstores';
import { PromptTemplate } from 'langchain/prompts';
import { CallbackManager } from 'langchain/callbacks';
import { Global, Injectable } from '@nestjs/common';
import { PinecodeApiService } from './pinecode.service';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { ChatDto } from 'src/chatterbox/dto/chat.dto';
import { LLMResult } from 'langchain/dist/schema';

@Global()
@Injectable()
export class LangChainService {
  constructor(private pinecodeApiService: PinecodeApiService) {}

  async respondToQuestion(chatDto: ChatDto) {
    return new Promise(async (resolve, reject) => {
      console.log('chatDto', chatDto);

      const question = chatDto.message.trim().replace(/\n./g, ' ');

      const index = await this.pinecodeApiService.getIndex();

      const vectorstore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({}),
        {
          pineconeIndex: index,
          textKey: 'text',
          namespace: chatDto.nodeId,
        },
      );

      let history = chatDto.history;

      let chatVectorDBQAChain = new ChatVectorDBQAChain({
        vectorstore,
        combineDocumentsChain: this.docChain((token) => {}),
        questionGeneratorChain: this.questionGenerator(),
        returnSourceDocuments: true,
        k: 2, //number of source documents to return
      });

      let response = await chatVectorDBQAChain.call({
        question,
        chat_history: history || [],
      });

      resolve(response);
    });
  }

  private questionGenerator() {
    return new LLMChain({
      llm: new OpenAIChat({ temperature: 0 }),
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
      new OpenAIChat({
        temperature: 0,
        modelName: 'gpt-3.5-turbo', //change this to older versions (e.g. gpt-3.5-turbo) if you don't have access to gpt-4
        streaming: true,
        callbackManager: callbackManager,
      }),
      { prompt: this.getQAprompt() },
    );

    return qaChain;
  }

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
  You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks.
  If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
  If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
  Question: {question}
  =========
  {context}
  =========
  Answer in Markdown:`,
    );
  }
}
