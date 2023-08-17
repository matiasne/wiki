import { Module, forwardRef } from '@nestjs/common';
import { ContentNodeService } from './content-node.service';
import { ContentNodeController } from './content-node.controller';
import { ContentNode } from './entities/content-node.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UserNodeRoleModule } from 'src/user-node-rol/user-node-rol.module';
import { PinecodeApiService } from 'src/services/pinecode.service';
import { IngestDataService } from 'src/services/ingest-data.service';
import { PythonScriptService } from 'src/services/pythonScripts/pythonScripts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentNode]),
    forwardRef(() => UsersModule),
    forwardRef(() => UserNodeRoleModule),
  ],
  controllers: [ContentNodeController],
  providers: [
    ContentNodeService,
    PinecodeApiService,
    IngestDataService,
    PythonScriptService,
  ],
  exports: [ContentNodeService],
})
export class ContentNodeModule {}
