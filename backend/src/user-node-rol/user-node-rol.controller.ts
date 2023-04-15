import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserNodeRoleService } from './user-node-rol.service';
import { CreateUserNodeRoleDto } from './dto/create-user-node-rol.dto';
import { UpdateUserNodeRoleDto } from './dto/update-user-node-rol.dto';
import { HttpExceptionFilter } from 'src/shared/http-exceptions.filter';
import { AuthGuard } from '@nestjs/passport';
@Controller('user-node-rol')
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class UserNodeRoleController {
  constructor(private readonly userNodeRoleService: UserNodeRoleService) {}

  @Post()
  create(@Body() createUserNodeRoleDto: CreateUserNodeRoleDto) {
    return this.userNodeRoleService.create(createUserNodeRoleDto);
  }

  @Get()
  findAll() {
    return this.userNodeRoleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userNodeRoleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserNodeRolDto: UpdateUserNodeRoleDto,
  ) {
    return this.userNodeRoleService.update(+id, updateUserNodeRolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userNodeRoleService.remove(+id);
  }
}
