import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationsModule } from 'src/invitations/invitations.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { User } from './entities/users.entity';
import { UserConfig } from './users.config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    NotificationsModule,
    forwardRef(() => InvitationsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserConfig],
  exports: [UsersService],
})
export class UsersModule {}
