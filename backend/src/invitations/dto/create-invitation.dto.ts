import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EnumNodeRoles } from 'src/user-node-rol/dto/create-user-node-rol.dto';

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class CreateInvitationDto {
  @IsNotEmpty()
  @IsEnum(EnumNodeRoles)
  role: EnumNodeRoles;

  status: string;

  expirationDate: string;

  token: string;

  @IsNotEmpty()
  @IsString()
  nodeId: string;

  @IsNotEmpty()
  @IsString()
  userReceivingEmail: string;
}
