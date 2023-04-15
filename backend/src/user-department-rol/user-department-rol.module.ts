import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDepartmentRol } from './entities/user-department-rol.entity';
import { UserDepartmentRolController } from './user-department-rol.controller';
import { UserDepartmentRolService } from './user-department-rol.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserDepartmentRol])],
  controllers: [UserDepartmentRolController],
  providers: [UserDepartmentRolService],
  exports: [UserDepartmentRolService],
})
export class UserDepartmentRolModule {}
