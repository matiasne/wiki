import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDepartmentRolModule } from 'src/user-department-rol/user-department-rol.module';
import { UsersModule } from 'src/users/users.module';
import { Comment } from './entities/comment.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { ChatterboxModule } from 'src/chatterbox/chatterbox.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersModule, ChatterboxModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
