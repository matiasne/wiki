import { Global, Injectable } from '@nestjs/common';
import { PineconeClient } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';

export interface IPinecodeVector {
  id: string;
  values: number[];
  metadata: Object;
}

@Global()
@Injectable()
export class PinecodeApiService {
  public pinecone = new PineconeClient();
  private testIndex: VectorOperationsApi = null;

  constructor() {
    this.init();
  }

  async init() {
    await this.pinecone.init({
      environment: 'us-east4-gcp',
      apiKey: '642356ea-6459-4834-ba6b-5d2191efda89',
    });

    const indexesList = await this.pinecone.listIndexes();
    this.testIndex = this.pinecone.Index(indexesList[0]);
  }

  async setIndex(indexName: string): Promise<any> {
    this.testIndex = this.pinecone.Index(indexName);
    return this.testIndex;
  }

  getIndex() {
    return this.testIndex;
  }

  async deleteBySource(nodeId: string, source: string): Promise<boolean> {
    const deleteRequest = {
      filter: { source: { $eq: source } },
      namespace: nodeId,
      include_metadata: true,
    };
    try {
      await this.testIndex._delete({ deleteRequest });
      return true;
    } catch (e) {
      return false;
    }
  }
}
