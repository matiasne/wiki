import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { ContentNodeService } from 'src/content-node/content-node.service';
import { ContentNodeModule } from 'src/content-node/content-node.module';
import { DocumentsGateway } from './documetns.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentText } from './entities/document.entity';
import { OpenAIService } from 'src/openai/openai.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentText]), ContentNodeModule],

  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentsGateway, OpenAIService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
