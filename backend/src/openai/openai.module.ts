import { Module } from '@nestjs/common';
import { OpenAIController } from './openai.controller';
import { OpenAIService } from 'src/openai/openai.service';
import { ContentNodeModule } from 'src/content-node/content-node.module';

@Module({
  imports: [ContentNodeModule],
  controllers: [OpenAIController],
  providers: [
    OpenAIService,
    //  ContentNodeService,
  ],
})
export class OpenAIModule {}
