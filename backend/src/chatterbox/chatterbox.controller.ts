import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseFilters,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/auth/auth.decorator';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { HttpExceptionFilter } from 'src/shared/http-exceptions.filter';
import { UpdateChatterboxDto } from './dto/update-chatterbox.dto';
import { CreateChatterboxDto } from './dto/create-chatterbox.dto';
import { ChatterboxService } from './chatterbox.service';
import { RespondService } from 'src/services/respond.service';
import { ChatDto } from 'src/pinecode-api/dto/chat.dto';
import { IngestDataService } from 'src/services/ingest-data.service';

@Controller('chatterbox')
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class ChatterboxController {
  constructor(
    private readonly chatterboxService: ChatterboxService,
    private readonly respondService: RespondService,
    private readonly ingestDataService: IngestDataService,
  ) {}

  @Post()
  async create(
    @AuthUser() user: IAuthUser,
    @Body() createChatterboxDto: CreateChatterboxDto,
  ) {
    return await this.chatterboxService.create(user, createChatterboxDto);
  }

  @Post('message')
  async processMsg(@AuthUser() user: IAuthUser, @Body() chatDto: ChatDto) {
    let data = await this.respondService.respondToQuestionTest(chatDto);
    return {
      data: data,
    };
  }

  @Get('process/:id')
  async processDoc(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    return await this.ingestDataService.IngestNodeData(id, user);
  }

  @Get(':id')
  async findAll(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    return await this.chatterboxService.findByNodeId(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatterboxDto: UpdateChatterboxDto,
  ) {
    return this.chatterboxService.update(id, updateChatterboxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatterboxService.remove(id);
  }
}
