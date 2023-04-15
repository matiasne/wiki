import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { UserConfig } from 'src/users/users.config';
import { UsersService } from 'src/users/users.service';
import { AuthConfig } from './auth.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategyCognito } from './strategies/jwtCognito.strategy';
@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthConfig,
    JwtStrategyCognito,
    UserConfig,
    UsersService,
  ],
})
export class AuthModule {}
