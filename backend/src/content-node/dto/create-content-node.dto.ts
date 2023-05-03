import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum EnumContentNodeType {
  CHATTERBOX = 'CHATTERBOX',
  FOLDER = 'FOLDER',
  FILE = 'FILE',
  RICH_TEXT = 'RICH_TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  LINK = 'LINK',
  DOCUMENT = 'DOCUMENT',
  URL = 'URL',
}

export class CreateContentNodeDto {
  @IsNotEmpty()
  @IsString()
  parentId: string;

  @IsString()
  emojiUnified: string;

  @IsString()
  data: string;

  @IsString()
  extension?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(EnumContentNodeType)
  type: EnumContentNodeType;
}
