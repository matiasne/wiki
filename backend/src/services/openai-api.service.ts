import { Global, Injectable } from '@nestjs/common';
import { OpenAIApi, Configuration, CreateCompletionRequest } from 'openai';

@Global()
@Injectable()
export class OpenaiApiService {
  private readonly openAIApi: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.openAIApi = new OpenAIApi(configuration);
  }

  /* async createCompletion({
    question,
    model,
    temperature,
  }: CreateCompletionDto) {
    try {
      const params: CreateCompletionRequest = {
        prompt: question,
        model: model || 'text-davinci-003',
        temperature: temperature || 0.9,
        max_tokens: 1000,
      };
      const { data } = await this.openAIApi.createCompletion(params);

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async generateEmbeddings(createEmbeddingsDto: CreateDocumentEmbeddingsDto) {
    const fragmentSize = 2000;
    const fragments = [];

    for (let i = 0; i < createEmbeddingsDto.text.length; i += fragmentSize) {
      fragments.push(createEmbeddingsDto.text.substring(i, i + fragmentSize));
    }

    const embeddings = await Promise.all(
      fragments.map(async (fragment) => {
        const embedding = await this.openAIApi.createEmbedding({
          model: 'text-embedding-ada-002',
          input: [fragment],
        });
        return embedding.data.data[0].embedding;
      }),
    );

    return embeddings;
  }*/
}
