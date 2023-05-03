import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatterboxDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  emojiUnified: string;

  @IsString()
  aditionalPrompt: string;
}
