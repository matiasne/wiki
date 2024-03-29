import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Invitation } from './invitations/entities/invitation.entity';
import { Notification } from './notifications/entities/notification.entity';
import { User } from './users/entities/users.entity';
import { UsersModule } from './users/users.module';
import { ContentNodeModule } from './content-node/content-node.module';
import { UserNodeRoleModule } from './user-node-rol/user-node-rol.module';
import { ContentNode } from './content-node/entities/content-node.entity';
import { UserNodeRole } from './user-node-rol/entities/user-node-rol.entity';
import { OpenAIModule } from './openai/openai.module';
import { DocumentsModule } from './documents/documents.module';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentText } from './documents/entities/document.entity';
import { ChatterBox } from './chatterbox/entities/chatterbox.entity';
import { ChatterboxModule } from './chatterbox/chatterbox.module';
import { Comment } from './comments/entities/comment.entity';
import { CommentsModule } from './comments/comments.module';
import { ConversationMessage } from './chatterbox/entities/conversation-message.entity';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      entities: [
        User,
        Invitation,
        Notification,
        ContentNode,
        UserNodeRole,
        DocumentText,
        ChatterBox,
        Comment,
        ConversationMessage,
      ],
    }),
    MulterModule.register({ dest: './docs' }),
    AuthModule,
    UsersModule,
    ContentNodeModule,
    UserNodeRoleModule,
    OpenAIModule,
    DocumentsModule,
    ChatterboxModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [
    //{
    //provide: APP_FILTER,
    //useClass: HttpExceptionFilter,
    //},
  ],
})
export class AppModule {}
