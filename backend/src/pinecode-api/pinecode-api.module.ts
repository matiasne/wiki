import { Module } from '@nestjs/common';
import { PinecodeApiService } from '../services/pinecode-api.service';
import { PinecodeApiController } from './pinecode-api.controller';
import { OpenaiApiService } from 'src/services/openai-api.service';
import { IngestDataService } from 'src/services/ingest-data.service';
import { RespondService } from 'src/services/respond.service';
import { ContentNodeService } from 'src/content-node/content-node.service';
import { ContentNodeModule } from 'src/content-node/content-node.module';

@Module({
  imports: [ContentNodeModule],
  controllers: [PinecodeApiController],
  providers: [
    PinecodeApiService,
    OpenaiApiService,
    IngestDataService,
    RespondService,
    //  ContentNodeService,
  ],
})
export class PinecodeApiModule {}
