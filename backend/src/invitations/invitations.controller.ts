import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/auth/auth.decorator';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { AccceptInvitationDto } from './dto/accept-invitation.dto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { DenyInvitationDto } from './dto/deny-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { InvitationsService } from './invitations.service';

@Controller('invitations')
@UseGuards(AuthGuard('jwt'))
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  create(
    @AuthUser() user: IAuthUser,
    @Body() createInvitationDto: CreateInvitationDto,
  ) {
    return this.invitationsService.create(user, createInvitationDto);
  }

  @Get()
  findAll() {
    return this.invitationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invitationsService.findOne(id);
  }

  @Get('/department/:id')
  findByDepartmentId(@Param('id') id: string) {
    return this.invitationsService.getPendingfindByDepartmentId(id);
  }

  @Post('/accept')
  accept(@AuthUser() user: IAuthUser, @Body() data: AccceptInvitationDto) {
    return this.invitationsService.accept(data.id, user);
  }

  @Post('/decline')
  decline(@AuthUser() user: IAuthUser, @Body() data: DenyInvitationDto) {
    return this.invitationsService.decline(data.id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInvitationDto: UpdateInvitationDto,
  ) {
    return this.invitationsService.update(id, updateInvitationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invitationsService.remove(id);
  }
}
