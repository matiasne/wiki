import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDepartmentRolModule } from 'src/user-department-rol/user-department-rol.module';
import { UsersModule } from 'src/users/users.module';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department]),
    UsersModule,
    UserDepartmentRolModule,
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
