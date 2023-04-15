import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsModule } from 'src/departments/departments.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UserDepartmentRolModule } from 'src/user-department-rol/user-department-rol.module';
import { UsersModule } from 'src/users/users.module';
import { Invitation } from './entities/invitation.entity';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation]),
    forwardRef(() => UsersModule),
    UserDepartmentRolModule,
    forwardRef(() => DepartmentsModule),
    NotificationsModule,
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
