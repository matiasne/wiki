import { IsNotEmpty, IsString } from 'class-validator';

export class AccceptInvitationDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
