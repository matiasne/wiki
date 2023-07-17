import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  chatterboxId: string;

  @IsString()
  nodeId: string;
}
