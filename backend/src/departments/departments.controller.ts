import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/auth/auth.decorator';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { HttpExceptionFilter } from 'src/shared/http-exceptions.filter';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Controller('departments')
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  async create(
    @AuthUser() user: IAuthUser,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ) {
    return await this.departmentsService.create(user, createDepartmentDto);
  }

  @Get()
  findAll(@AuthUser() user: IAuthUser) {
    return this.departmentsService.findAllByUser(user);
  }

  @Get(':id')
  findOne(@AuthUser() user: IAuthUser, @Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: CreateDepartmentDto,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }
}
