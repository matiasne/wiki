import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ChatDto } from '../chatterbox/dto/chat.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/auth/auth.decorator';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { OpenAIService } from 'src/openai/openai.service';
import { ImageDescriptorDto } from './dto/imageDescriptor.dto';

@Controller('openai')
@UseGuards(AuthGuard('jwt'))
export class OpenAIController {
  constructor(private readonly openaiApiService: OpenAIService) {}

  @Post('process')
  async findAll(@AuthUser() user: IAuthUser) {}

  @Post('image')
  async image(
    @AuthUser() user: IAuthUser,
    @Body() imageDescriptor: ImageDescriptorDto,
  ) {
    return this.openaiApiService.createCompletion(
      'de que se trata esta imagen. ten en cuenta que está relacionada al siguiente contexto: Elementos de un Diagrama de flujo para software ' +
        imageDescriptor.url,
    );
  }
}
