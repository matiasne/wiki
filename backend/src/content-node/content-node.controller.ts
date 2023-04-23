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
import { ContentNodeService } from './content-node.service';
import { CreateContentNodeDto } from './dto/create-content-node.dto';
import { UpdateContentNodeDto } from './dto/update-content-node.dto';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/shared/http-exceptions.filter';
import { AuthUser } from 'src/auth/auth.decorator';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';

@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
@Controller('content-node')
export class ContentNodeController {
  constructor(private readonly contentNodeService: ContentNodeService) {}

  @Post()
  create(
    @AuthUser() user: IAuthUser,
    @Body() createContentNodeDto: CreateContentNodeDto,
  ) {
    return this.contentNodeService.create(user, createContentNodeDto);
  }

  @Get()
  findAll(@AuthUser() user: IAuthUser) {
    return this.contentNodeService.findAll(user);
  }

  @Get('root')
  findRoots(@AuthUser() user: IAuthUser) {
    return this.contentNodeService.findRoots(user);
  }

  @Get(':id')
  findOne(@AuthUser() user: IAuthUser, @Param('id') id: string) {
    return this.contentNodeService.findOne(user, id);
  }

  @Get(':id/childs')
  findDescendantsTree(@AuthUser() user: IAuthUser, @Param('id') id: string) {
    return this.contentNodeService.findDescendantsTree(user, id);
  }

  @Patch(':id')
  update(
    @AuthUser() user: IAuthUser,
    @Param('id') id: string,
    @Body() updateContentNodeDto: UpdateContentNodeDto,
  ) {
    return this.contentNodeService.update(user, id, updateContentNodeDto);
  }

  @Delete(':id')
  remove(@AuthUser() user: IAuthUser, @Param('id') id: string) {
    return this.contentNodeService.remove(user, id);
  }
}
