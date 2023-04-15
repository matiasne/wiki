import { Module } from '@nestjs/common';
import { ContentNodeService } from './content-node.service';
import { ContentNodeController } from './content-node.controller';
import { ContentNode } from './entities/content-node.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UserNodeRoleModule } from 'src/user-node-rol/user-node-rol.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentNode]),
    UsersModule,
    UserNodeRoleModule,
  ],
  controllers: [ContentNodeController],
  providers: [ContentNodeService],
  exports: [ContentNodeService],
})
export class ContentNodeModule {}
