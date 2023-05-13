import { Global, Injectable } from '@nestjs/common';
import { OpenAIApi, Configuration, CreateCompletionRequest } from 'openai';

@Global()
@Injectable()
export class OpenAIService {
  private readonly openAIApi: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.openAIApi = new OpenAIApi(configuration);
  }

  async defineTypeOfTextReceived(text) {
    let resp = await this.createCompletion(
      `Define if the next text is a question, afirmation, negation or neutral : ${text}`,
    );

    return resp.choices[0].text
      .replace(/(?:\r\n|\r|\n)/g, '')
      .trim()
      .toLowerCase();
  }

  async createCompletion(question, model?, temperature?) {
    try {
      const params: CreateCompletionRequest = {
        prompt: question,
        model: model || 'text-davinci-003',
        temperature: temperature || 0.3,
        max_tokens: 300,
      };
      const { data } = await this.openAIApi.createCompletion(params);

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }
}
