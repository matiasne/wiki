import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { DepartmentsService } from 'src/departments/departments.service';
import { Department } from 'src/departments/entities/department.entity';
import {
  CreateNotificationDto,
  EnumNotificationStatus,
  EnumNotificationType,
} from 'src/notifications/dto/create-notification.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserDepartmentRolService } from 'src/user-department-rol/user-department-rol.service';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import {
  CreateInvitationDto,
  InvitationStatus,
} from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { Invitation } from './entities/invitation.entity';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationsRepository: Repository<Invitation>,
    private readonly userDepartmentRolService: UserDepartmentRolService,
    private readonly userService: UsersService,
    private readonly departmentService: DepartmentsService,
    private readonly notificationService: NotificationsService,
  ) {}

  async create(user: IAuthUser, cInvitationDto: CreateInvitationDto) {
    console.log(user);

    let userReceiving = await this.userService.getByEmail(
      cInvitationDto.userReceivingEmail,
    );

    const department: Department = await this.departmentService.getById(
      cInvitationDto.departmentId,
    );

    if (
      !this.userDepartmentRolService.checkIfUserIsOwner(
        user.id,
        cInvitationDto.departmentId,
      )
    ) {
      console.log('Is not the owner');
    }

    const userSender: User = await this.userService.getById(user.id);

    let inv: Invitation = this.invitationsRepository.create();
    inv.userSender = userSender;
    inv.userReceivingEmail = cInvitationDto.userReceivingEmail;
    inv.department = department;
    inv.status = InvitationStatus.PENDING;
    inv.rol = cInvitationDto.rol;

    let invitation = await this.invitationsRepository.save(inv);

    if (!userReceiving) {
      console.log('Sending email to the user to register in the platform');
    } else {
      console.log('Sending email to the user to login in the platform');
      let notification = new CreateNotificationDto();

      notification.message = `You have been invited to the department ${department.name} by ${userReceiving.name} as ${cInvitationDto.rol}`;
      notification.status = EnumNotificationStatus.CREATED;
      notification.type = EnumNotificationType.INVITATION;
      notification.typeRefUID = invitation.id;
      notification.userId = userReceiving.id;
      await this.notificationService.create(notification);
    }

    return invitation;
  }

  async getPendingfindByDepartmentId(departmentId: string) {
    return await this.invitationsRepository
      .createQueryBuilder('invitations')
      .leftJoinAndSelect('invitations.department', 'department')
      .leftJoinAndSelect('invitations.userReceiving', 'user')
      .where('department.id=:departmentId')
      .andWhere('invitations.status=:status')
      .setParameters({
        departmentId: departmentId,
        status: InvitationStatus.PENDING,
      })
      .getMany();
  }

  async accept(id: string, user: IAuthUser) {
    console.log(id);
    const userL: User = await this.userService.getById(user.id);

    this.notificationService.readed(EnumNotificationType.INVITATION, id);

    const invitation: Invitation = await this.invitationsRepository.findOne({
      where: { id: id },
      relations: ['department'],
    });

    console.log(invitation);

    if (!invitation) {
      return 'error';
    }

    if (invitation.userReceivingEmail != userL.email) {
      return 'error';
    }

    invitation.status = InvitationStatus.ACCEPTED;

    const department = await this.departmentService.getById(
      invitation.department.id,
    );

    this.userDepartmentRolService.create({
      rol: invitation.rol,
      department: department,
      user: userL,
    });

    await this.invitationsRepository.save(invitation);
  }

  async decline(id: string, user: IAuthUser) {
    const userL: User = await this.userService.getById(user.id);

    const invitation: Invitation = await this.invitationsRepository.findOne({
      where: { id: id },
    });

    if (invitation) {
      if (invitation.userReceivingEmail != userL.email) {
        return 'error';
      }

      invitation.status = InvitationStatus.REJECTED;
      await this.invitationsRepository.save(invitation);
    }

    this.notificationService.readed(EnumNotificationType.INVITATION, id);
  }

  async findAll() {
    return await this.invitationsRepository.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} invitation`;
  }

  update(id: string, updateInvitationDto: UpdateInvitationDto) {
    return `This action updates a #${id} invitation`;
  }

  async remove(id: string) {
    return await this.invitationsRepository.delete(id);
  }
}
