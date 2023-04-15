import { Global, Injectable } from '@nestjs/common';
import { PineconeClient } from '@pinecone-database/pinecone';
import { CreateUploadTextPinecodeDbDto } from 'src/pinecode-api/dto/create-upload-text-pinecode.dto';
import { UpdatePinecodeApiDto } from 'src/pinecode-api/dto/update-pinecode-api.dto';
import { OpenaiApiService } from 'src/services/openai-api.service';

export interface IPinecodeVector {
  id: string;
  values: number[];
  metadata: Object;
}

@Global()
@Injectable()
export class PinecodeApiService {
  public pinecone = new PineconeClient();
  private testIndex = null;

  constructor(private openaiService: OpenaiApiService) {
    this.init();
  }

  async init() {
    await this.pinecone.init({
      environment: 'us-east4-gcp',
      apiKey: '642356ea-6459-4834-ba6b-5d2191efda89',
    });

    const indexesList = await this.pinecone.listIndexes();
    this.testIndex = this.pinecone.Index(indexesList[0]);
    console.log('indexesList', indexesList);
  }

  async setIndex(indexName: string): Promise<any> {
    this.testIndex = this.pinecone.Index(indexName);
    return this.testIndex;
  }

  getIndex() {
    return this.testIndex;
  }

  async upsert(vectors: IPinecodeVector[]) {
    let insertBatches = [];

    const interval = setInterval(async () => {
      let batchedVectors = vectors.splice(0, 250);

      const upsertRequest = {
        vectors: batchedVectors,
        namespace: 'test2',
      };
      console.log('enviando...');
      try {
        const upsertResponse = await this.testIndex.upsert({ upsertRequest });
        insertBatches.push(upsertResponse);
      } catch (e) {
        console.log('error', e);
        clearInterval(interval);
      }

      if (vectors.length == 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  async search(query: string) {
    const searchRequest = {
      query: query,
      namespace: 'test2',
      k: 5,
    };

    const searchResponse = await this.testIndex.search({ searchRequest });
    return searchResponse;
  }
}
