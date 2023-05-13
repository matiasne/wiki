import { Module } from '@nestjs/common';
import { PinecodeApiService } from '../services/pinecode.service';
import { OpenAIController } from './openai.controller';
import { OpenAIService } from 'src/openai/openai.service';
import { IngestDataService } from 'src/services/ingest-data.service';
import { ContentNodeModule } from 'src/content-node/content-node.module';

@Module({
  imports: [ContentNodeModule],
  controllers: [OpenAIController],
  providers: [
    PinecodeApiService,
    OpenAIService,
    IngestDataService,
    //  ContentNodeService,
  ],
})
export class OpenAIModule {}
