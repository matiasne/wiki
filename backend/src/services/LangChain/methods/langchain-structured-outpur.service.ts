import { ChatOpenAI } from 'langchain/chat_models/openai';

import { Global, Injectable } from '@nestjs/common';
import { ChainValues, LLMResult } from 'langchain/dist/schema';
import { RelevantsDocumentsService } from '../relevants-documents.service';
import { z } from 'zod';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/dist/prompts';

import {
  StructuredOutputParser,
  OutputFixingParser,
} from 'langchain/output_parsers';
import { LLMChain } from 'langchain/dist/chains/llm_chain';

@Global()
@Injectable()
export class LangChainStructuredOutputService {
  constructor(private relevantsDocumentsService: RelevantsDocumentsService) {}

  async usingRefineDocumentsChain(
    question: string,
    chatterboxId: string,
    nodeIdDocument?: string,
  ): Promise<ChainValues> {
    return new Promise(async (resolve, reject) => {
      const outputParser = StructuredOutputParser.fromZodSchema(
        z
          .array(
            z.object({
              fields: z.object({
                Name: z.string().describe('The name of the country'),
                Capital: z.string().describe("The country's capital"),
              }),
            }),
          )
          .describe(
            'An array of Airtable records, each representing a country',
          ),
      );

      const chatModel = new ChatOpenAI({
        modelName: 'gpt-4', // Or gpt-3.5-turbo
        temperature: 0, // For best results with the output fixing parser
      });

      const outputFixingParser = OutputFixingParser.fromLLM(
        chatModel,
        outputParser,
      );

      const prompt = new PromptTemplate({
        template: `Answer the user's question as best you can:\n{format_instructions}\n{query}`,
        inputVariables: ['query'],
        partialVariables: {
          format_instructions: outputFixingParser.getFormatInstructions(),
        },
      });

      // For those unfamiliar with LangChain, a class used to call LLMs
      const answerFormattingChain = new LLMChain({
        llm: chatModel,
        prompt: prompt,
        outputKey: 'records', // For readability - otherwise the chain output will default to a property named "text"
        outputParser: outputFixingParser,
      });

      const result = await answerFormattingChain.call({
        //    input_documents: [],
        query: 'List 5 countries.',
      });

      resolve(result);
    });
  }
}
