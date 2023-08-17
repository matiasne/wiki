import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChatterboxDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  emojiUnified: string;

  @IsString()
  aditionalPrompt: string;

  @IsString()
  temperature: string;

  @IsString()
  textChunkSize: string;

  @IsString()
  textOverlapSize: string;
}
