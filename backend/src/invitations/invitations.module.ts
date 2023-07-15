import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';
import { Invitation } from './entities/invitation.entity';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { UserNodeRoleModule } from 'src/user-node-rol/user-node-rol.module';
import { ContentNodeModule } from 'src/content-node/content-node.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation]),
    forwardRef(() => UsersModule),
    forwardRef(() => ContentNodeModule),
    UserNodeRoleModule,
    NotificationsModule,
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
