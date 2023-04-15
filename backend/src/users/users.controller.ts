import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/auth/auth.decorator';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { HttpExceptionFilter } from 'src/shared/http-exceptions.filter';
import { UsersService } from './users.service';

@Controller('users')
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getMy(@AuthUser() user: IAuthUser) {
    return this.usersService.getMy(user.id);
  }

  @Get('/all')
  findAll() {
    return this.usersService.findAll();
  }
}
