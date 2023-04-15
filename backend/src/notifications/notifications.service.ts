import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthUser } from 'src/auth/interfaces/auth.interfaces';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import {
  CreateNotificationDto,
  EnumNotificationStatus,
  EnumNotificationType,
} from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    let notification: Notification = this.notificationsRepository.create();
    notification.status = EnumNotificationStatus.SENT;
    notification.message = createNotificationDto.message;
    notification.type = createNotificationDto.type;
    notification.typeRefUID = createNotificationDto.typeRefUID;

    let user = await this.usersService.getById(createNotificationDto.userId);

    notification.user = user;

    return this.notificationsRepository.save(notification);
  }

  async findAll() {
    return await this.notificationsRepository.find();
  }

  async findAllOfAuthUser(authUser: IAuthUser) {
    return await await this.notificationsRepository
      .createQueryBuilder('invitations')
      .leftJoinAndSelect('invitations.user', 'user')
      .where('user.id=:userId')
      .andWhere('status=:status')
      .setParameters({
        userId: authUser.id,
        status: EnumNotificationStatus.SENT,
      })
      .getMany();
  }

  async readed(type: EnumNotificationType, typeId: string) {
    let notification = await this.notificationsRepository.findOne({
      where: { type: type, typeRefUID: typeId },
    });
    notification.status = EnumNotificationStatus.READ;
    return await notification.save();
  }

  findOne(id: string) {
    return `This action returns a #${id} notification`;
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  async remove(id: string) {
    return await this.notificationsRepository.delete(id);
  }
}
