import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { IngestDataService } from 'src/services/ingest-data.service';
import { RespondService } from 'src/services/respond.service';
import { ChatDto } from './dto/chat.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/auth/auth.decorator';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';

@Controller('pinecode')
@UseGuards(AuthGuard('jwt'))
export class PinecodeApiController {
  constructor(
    private readonly ingestDataService: IngestDataService,
    private readonly respondService: RespondService,
  ) {}

  @Post('process')
  async findAll(@AuthUser() user: IAuthUser) {
    // return this.ingestDataService.IngestAllUserData(user);
  }

  @Post('/question')
  async makeQuestion(@Body() chatDto: ChatDto) {
    let data = await this.respondService.respondToQuestionTest(chatDto);
    return {
      data: data,
    };
  }
}
