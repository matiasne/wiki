import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Rol } from 'src/user-department-rol/dto/create-user-department-rol.dto';

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class CreateInvitationDto {
  @IsNotEmpty()
  @IsEnum(Rol)
  rol: Rol;

  status: string;

  expirationDate: string;

  token: string;

  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @IsNotEmpty()
  @IsString()
  userReceivingEmail: string;
}
