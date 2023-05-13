import { Global, Injectable, Logger, UseGuards } from '@nestjs/common';

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import {
  CSVLoader,
  CheerioWebBaseLoader,
  DocxLoader,
  JSONLoader,
  SRTLoader,
  TextLoader,
} from 'langchain/document_loaders';
import { PinecodeApiService } from './pinecode.service';
import { CustomPDFLoader } from 'src/utils/customPDFLoader';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { EnumContentNodeType } from 'src/content-node/dto/create-content-node.dto';
import { EnumLangchainFilesType } from 'src/shared/enum.langchain-files-types';
import { ContentNode } from 'src/content-node/entities/content-node.entity';

@Global()
@Injectable()
export class IngestDataService {
  private logger: Logger = new Logger('IngestDataService');

  private basePath = './uploads/';

  constructor(private pinecodeApiService: PinecodeApiService) {}

  async processNodeData(
    user: IAuthUser,
    node: ContentNode,
    rootNodeId: string,
  ) {
    if (node.type == EnumContentNodeType.FILE) {
      let loader: any;

      if (node.extension == EnumLangchainFilesType.pdf) {
        loader = new CustomPDFLoader(this.basePath + node.data);
      }

      if (node.extension == EnumLangchainFilesType.csv) {
        loader = new CSVLoader(this.basePath + node.data);
      }

      if (node.extension == EnumLangchainFilesType.json) {
        loader = new JSONLoader(this.basePath + node.data);
      }

      if (node.extension == EnumLangchainFilesType.docx) {
        loader = new DocxLoader(this.basePath + node.data);
      }

      if (node.extension == EnumLangchainFilesType.txt) {
        loader = new TextLoader(this.basePath + node.data);
      }

      if (node.extension == EnumLangchainFilesType.srt) {
        loader = new SRTLoader(node.data);
      }

      if (
        node.extension == EnumLangchainFilesType.png ||
        node.extension == EnumLangchainFilesType.jpg ||
        node.extension == EnumLangchainFilesType.jpeg
      ) {
      }

      if (loader) {
        const docs = await loader.load();
        this.processDocs(docs, rootNodeId, node.id);
      }
    }

    if (node.type == EnumContentNodeType.URL) {
      const urlloader = new CheerioWebBaseLoader(node.data);
      const urldocs = await urlloader.load();
      this.processDocs(urldocs, rootNodeId, node.id);
    }

    if (node.type == EnumContentNodeType.RICH_TEXT) {
      this.processText(node.data, rootNodeId, node.id);
    }
  }

  async processDocs(docs: any, namespace: string, nodeId: string) {
    try {
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const docsSplits = await textSplitter.splitDocuments(docs);
      //create and store the embeddings in the vectorStore
      const embeddings = new OpenAIEmbeddings();
      const index = await this.pinecodeApiService.setIndex(
        process.env.PINECONE_INDEX_NAME,
      ); //change to your own index name
      //embed the PDF documents
      await PineconeStore.fromDocuments(docsSplits, embeddings, {
        pineconeIndex: index,
        filter: {
          nodeId: nodeId,
        },
        namespace: namespace,
        textKey: 'text',
      });
    } catch (e) {
      this.logger.log(e);
    }
  }

  private async processText(data: string, namespace: string, nodeId: string) {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitText(data);
    //create and store the embeddings in the vectorStore
    const embeddings = new OpenAIEmbeddings();
    const index = await this.pinecodeApiService.setIndex(
      process.env.PINECONE_INDEX_NAME,
    ); //change to your own index name
    //embed the PDF documents

    let metadata = docs.map((doc, i) => {
      return {
        id: i,
        nodeId: nodeId,
      };
    });

    await PineconeStore.fromTexts(docs, metadata, embeddings, {
      pineconeIndex: index,
      filter: {
        nodeId: nodeId,
      },
      namespace: namespace,
      textKey: 'text',
    });
  }

  async IMGLoader(imgURL: string) {}
}
