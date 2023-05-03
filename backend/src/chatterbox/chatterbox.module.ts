import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDepartmentRolModule } from 'src/user-department-rol/user-department-rol.module';
import { UsersModule } from 'src/users/users.module';
import { ChatterBox } from './entities/chatterbox.entity';
import { ChatterboxController } from './chatterbox.controller';
import { ChatterboxService } from './chatterbox.service';
import { ContentNodeModule } from 'src/content-node/content-node.module';
import { RespondService } from 'src/services/respond.service';
import { PinecodeApiModule } from 'src/pinecode-api/pinecode-api.module';
import { PinecodeApiService } from 'src/services/pinecode-api.service';
import { IngestDataService } from 'src/services/ingest-data.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatterBox]),
    ContentNodeModule,
    PinecodeApiModule,
  ],
  controllers: [ChatterboxController],
  providers: [
    ChatterboxService,
    RespondService,
    PinecodeApiService,
    IngestDataService,
  ],
  exports: [ChatterboxService],
})
export class ChatterboxModule {}
