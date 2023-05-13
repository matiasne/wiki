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
import { LangChainService } from 'src/services/langchain.service';
import { ChatDto } from 'src/chatterbox/dto/chat.dto';
import { UpdateContentNodeDto } from 'src/content-node/dto/update-content-node.dto';
import { EnumContentNodeType } from 'src/content-node/dto/create-content-node.dto';
import { OpenAIService } from 'src/openai/openai.service';

@Controller('chatterbox')
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class ChatterboxController {
  constructor(
    private readonly chatterboxService: ChatterboxService,
    private readonly langChainService: LangChainService,
    private readonly openaiService: OpenAIService,
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
    let typeMessage = await this.openaiService.defineTypeOfTextReceived(
      chatDto.message,
    );

    let response = {
      data: null,
      interpretation: typeMessage,
    };
    if (typeMessage.includes('question'))
      response.data = await this.langChainService.respondToQuestion(chatDto);

    return response;
  }

  @Get('process/:id')
  async processDoc(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    // return await this.ingestDataService.IngestChatterBoxNodeData(id, user);
  }

  @Get(':id')
  async findAll(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    return await this.chatterboxService.findByNodeId(id);
  }

  @Patch(':id')
  update(
    @AuthUser() user: IAuthUser,
    @Param('id') id: string,
    @Body() updateChatterboxDto: UpdateContentNodeDto,
  ) {
    console.log(id);
    updateChatterboxDto.type = EnumContentNodeType.CHATTERBOX;
    return this.chatterboxService.update(user, id, updateChatterboxDto);
  }

  @Delete(':id')
  remove(@AuthUser() user: IAuthUser, @Param('id') id: string) {
    return this.chatterboxService.remove(user, id);
  }
}
