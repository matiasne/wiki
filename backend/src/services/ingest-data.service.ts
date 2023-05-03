import { Global, Injectable, Logger, UseGuards } from '@nestjs/common';

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import {
  CSVLoader,
  CheerioWebBaseLoader,
  DirectoryLoader,
  DocxLoader,
  JSONLoader,
  SRTLoader,
  TextLoader,
  UnstructuredLoader,
} from 'langchain/document_loaders';
import { PinecodeApiService } from './pinecode-api.service';
import { CustomPDFLoader } from 'src/utils/customPDFLoader';
import { AuthGuard } from '@nestjs/passport';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { ContentNodeService } from 'src/content-node/content-node.service';
import { EnumContentNodeType } from 'src/content-node/dto/create-content-node.dto';
import { extname } from 'path';
import { EnumLangchainFilesType } from 'src/shared/enum.langchain-files-types';

@Global()
@Injectable()
export class IngestDataService {
  private logger: Logger = new Logger('IngestDataService');

  private basePath = './uploads/';

  constructor(
    private pinecodeApiService: PinecodeApiService,
    private contentNodeService: ContentNodeService,
  ) {}

  async IngestNodeData(nodeId: string, user: IAuthUser) {
    const namespace = nodeId;

    this.contentNodeService
      .findDescendantsTree(user, nodeId)
      .then(async (node) => {
        if (node && node.childrens && node.childrens.length > 0) {
          //process file that fit in the unstructured data

          //process plain text
          node.childrens.map(async (n) => {
            if (n.type == EnumContentNodeType.FILE) {
              let loader: any;

              if (n.extension == EnumLangchainFilesType.pdf) {
                loader = new CustomPDFLoader(this.basePath + n.data);
              }

              if (n.extension == EnumLangchainFilesType.csv) {
                loader = new CSVLoader(this.basePath + n.data);
              }

              if (n.extension == EnumLangchainFilesType.json) {
                loader = new JSONLoader(this.basePath + n.data);
              }

              if (n.extension == EnumLangchainFilesType.docx) {
                loader = new DocxLoader(this.basePath + n.data);
              }

              if (n.extension == EnumLangchainFilesType.txt) {
                loader = new TextLoader(this.basePath + n.data);
              }

              if (n.extension == EnumLangchainFilesType.srt) {
                loader = new SRTLoader(n.data);
              }

              if (loader) {
                const docs = await loader.load();
                this.processDocs(docs, namespace, node.id);
              }
            }

            if (n.type == EnumContentNodeType.URL) {
              try {
                console.log(n.data);
                const urlloader = new CheerioWebBaseLoader(n.data);
                const urldocs = await urlloader.load();
                console.log(urldocs);
                this.processDocs(urldocs, namespace, node.id);
              } catch (err) {
                console.log(err);
                console.log(err.stack);
              }
            }

            if (n.type == EnumContentNodeType.RICH_TEXT) {
              this.processText(n.data, namespace, node.id);
            }
          });
        }
      });
  }

  async processDocs(docs: any, namespace: string, parentId: string) {
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
          nodeId: namespace,
          parentNode: parentId,
        },
        namespace: namespace,
        textKey: 'text',
      });
    } catch (e) {
      this.logger.log(e);
    }
  }

  private async processText(data: string, namespace: string, parenId: string) {
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
        nodeId: namespace,
        parentNode: parenId,
      };
    });

    await PineconeStore.fromTexts(docs, metadata, embeddings, {
      pineconeIndex: index,
      filter: {
        nodeId: namespace,
        parentNode: parenId,
      },
      namespace: namespace,
      textKey: 'text',
    });
  }
}
