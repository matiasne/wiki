import { IsNotEmpty, IsString } from 'class-validator';

export enum EnumNotificationType {
  INVITATION = 'INVITATION',
  MESSAGE = 'MESSAGE',
  TASK = 'TASK',
  OTHER = 'OTHER',
}

export enum EnumNotificationStatus {
  CREATED = 'CREATED',
  SENT = 'SENT',
  READ = 'READ',
}

export class CreateNotificationDto {
  status: EnumNotificationStatus;

  message: string;

  type: EnumNotificationType;

  typeRefUID: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
