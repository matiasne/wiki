import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Comment } from './entities/comment.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { ChatterboxModule } from 'src/chatterbox/chatterbox.module';
import { IngestDataService } from 'src/services/ingest-data.service';
import { PinecodeApiService } from 'src/services/pinecode.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersModule, ChatterboxModule],
  controllers: [CommentsController],
  providers: [CommentsService, IngestDataService, PinecodeApiService],
  exports: [CommentsService],
})
export class CommentsModule {}
