import { Module } from '@nestjs/common';
import { UserNodeRoleService } from './user-node-rol.service';
import { UserNodeRoleController } from './user-node-rol.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNodeRole } from './entities/user-node-rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserNodeRole])],
  controllers: [UserNodeRoleController],
  providers: [UserNodeRoleService],
  exports: [UserNodeRoleService],
})
export class UserNodeRoleModule {}
