import { Global, Injectable, Logger, UseGuards } from '@nestjs/common';

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
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
        this.processDocs(docs, rootNodeId, node.id, user);
      }
    }

    if (node.type == EnumContentNodeType.URL) {
      const urlloader = new CheerioWebBaseLoader(node.data);
      const urldocs = await urlloader.load();
      this.processDocs(urldocs, rootNodeId, node.id, user);
    }

    if (node.type == EnumContentNodeType.RICH_TEXT) {
      this.processText(node.data, rootNodeId, node.id, user);
    }
  }

  async processDocs(
    docs: any,
    namespace: string,
    nodeId: string,
    user: IAuthUser,
  ) {
    try {
      console.log('docs', docs);
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const docsSplits = await textSplitter.splitDocuments(docs);
      for await (let doc of docsSplits) {
        doc.metadata['nodeId'] = nodeId;
        doc.metadata['userId'] = user.id;
        doc.metadata['userName'] = user.username;
      }

      console.log('docsSplits', docsSplits);

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
          userId: user.id,
          userName: user.username,
        },
        namespace: namespace,
        textKey: 'text',
      });
    } catch (e) {
      this.logger.log(e);
    }
  }

  public async processText(
    data: string,
    namespace: string,
    nodeId: string,
    user: IAuthUser,
  ) {
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
        userId: user.id,
        userName: user.username,
      };
    });

    await PineconeStore.fromTexts(docs, metadata, embeddings, {
      pineconeIndex: index,
      filter: {
        nodeId: nodeId,
        creator: user.id,
        creatorName: user.username,
      },
      namespace: namespace,
      textKey: 'text',
    });
  }

  async IMGLoader(imgURL: string) {}
}
