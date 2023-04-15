import { Controller, Get, Post, Body } from '@nestjs/common';
import { IngestDataService } from 'src/services/ingest-data.service';
import { RespondService } from 'src/services/respond.service';
import { ChatDto } from './dto/chat.dto';

@Controller('pinecode-api')
export class PinecodeApiController {
  constructor(
    private readonly ingestDataService: IngestDataService,
    private readonly respondService: RespondService,
  ) {}

  @Get()
  async findAll() {
    return this.ingestDataService.IngestData('docs');
  }

  @Post('/question')
  async makeQuestion(@Body() chatDto: ChatDto) {
    let data = await this.respondService.respondToQuestionTest(chatDto);
    return {
      data: data,
    };
  }
}
