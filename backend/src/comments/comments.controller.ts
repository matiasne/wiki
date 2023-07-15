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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/createComment.dto';

@Controller('comments')
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @AuthUser() user: IAuthUser,
    @Body() createDepartmentDto: CreateCommentDto,
  ) {
    return await this.commentsService.create(user, createDepartmentDto);
  }

  @Get()
  findAll(@AuthUser() user: IAuthUser) {
    // return this.commentsService.findAllByUser(user);
  }

  @Get(':id')
  findOne(@AuthUser() user: IAuthUser, @Param('id') id: string) {
    // return this.commentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto) {
    // return this.commentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.commentsService.remove(id);
  }
}
