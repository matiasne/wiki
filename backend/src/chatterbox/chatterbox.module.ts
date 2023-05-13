import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDepartmentRolModule } from 'src/user-department-rol/user-department-rol.module';
import { UsersModule } from 'src/users/users.module';
import { ChatterBox } from './entities/chatterbox.entity';
import { ChatterboxController } from './chatterbox.controller';
import { ChatterboxService } from './chatterbox.service';
import { ContentNodeModule } from 'src/content-node/content-node.module';
import { LangChainService } from 'src/services/langchain.service';
import { OpenAIModule } from 'src/openai/openai.module';
import { PinecodeApiService } from 'src/services/pinecode.service';
import { IngestDataService } from 'src/services/ingest-data.service';
import { OpenAIService } from 'src/openai/openai.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatterBox]),
    ContentNodeModule,
    OpenAIModule,
  ],
  controllers: [ChatterboxController],
  providers: [
    ChatterboxService,
    LangChainService,
    PinecodeApiService,
    OpenAIService,
    IngestDataService,
  ],
  exports: [ChatterboxService],
})
export class ChatterboxModule {}
