import { Global, Injectable } from '@nestjs/common';

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { DirectoryLoader } from 'langchain/document_loaders';
import { PinecodeApiService } from './pinecode-api.service';
import { CustomPDFLoader } from 'src/utils/customPDFLoader';

@Global()
@Injectable()
export class IngestDataService {
  constructor(private pinecodeApiService: PinecodeApiService) {}

  async IngestData(filePath: string) {
    // try {
    /*load raw docs from the all files in the directory */
    console.log(filePath);
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new CustomPDFLoader(path),
    });

    // const loader = new PDFLoader(filePath);
    const rawDocs = await directoryLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();
    const index = await this.pinecodeApiService.setIndex(
      process.env.PINECONE_INDEX_NAME,
    ); //change to your own index name

    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: process.env.PINECONE_NAME_SPACE,
      textKey: 'text',
    });
    // } catch (error) {
    //   console.log('error', error);
    //   throw new Error('Failed to ingest your data');
    // }
  }
}
