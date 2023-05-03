import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DepartmentsModule } from './departments/departments.module';
import { Department } from './departments/entities/department.entity';
import { Invitation } from './invitations/entities/invitation.entity';
import { Notification } from './notifications/entities/notification.entity';
import { UserDepartmentRol } from './user-department-rol/entities/user-department-rol.entity';
import { UserDepartmentRolModule } from './user-department-rol/user-department-rol.module';
import { User } from './users/entities/users.entity';
import { UsersModule } from './users/users.module';
import { ContentNodeModule } from './content-node/content-node.module';
import { UserNodeRoleModule } from './user-node-rol/user-node-rol.module';
import { ContentNode } from './content-node/entities/content-node.entity';
import { UserNodeRole } from './user-node-rol/entities/user-node-rol.entity';
import { PinecodeApiModule } from './pinecode-api/pinecode-api.module';
import { DocumentsModule } from './documents/documents.module';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentText } from './documents/entities/document.entity';
import { ChatterBox } from './chatterbox/entities/chatterbox.entity';
import { ChatterboxModule } from './chatterbox/chatterbox.module';

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
        Department,
        UserDepartmentRol,
        Invitation,
        Notification,
        ContentNode,
        UserNodeRole,
        DocumentText,
        ChatterBox,
      ],
    }),
    MulterModule.register({ dest: './docs' }),
    AuthModule,
    UsersModule,
    DepartmentsModule,
    UserDepartmentRolModule,
    ContentNodeModule,
    UserNodeRoleModule,
    PinecodeApiModule,
    DocumentsModule,
    ChatterboxModule,
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
