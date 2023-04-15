import { Module } from '@nestjs/common';
import { PinecodeApiService } from '../services/pinecode-api.service';
import { PinecodeApiController } from './pinecode-api.controller';
import { OpenaiApiService } from 'src/services/openai-api.service';
import { IngestDataService } from 'src/services/ingest-data.service';
import { RespondService } from 'src/services/respond.service';

@Module({
  controllers: [PinecodeApiController],
  providers: [
    PinecodeApiService,
    OpenaiApiService,
    IngestDataService,
    RespondService,
  ],
})
export class PinecodeApiModule {}
