import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum EnumContentNodeType {
  FOLDER = 'FOLDER',
  FILE = 'FILE',
  RICH_TEXT = 'RICH_TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  LINK = 'LINK',
  DOCUMENT = 'DOCUMENT',
}

export class CreateContentNodeDto {
  @IsNotEmpty()
  @IsString()
  parentId: string;

  order: string;

  data: string;

  icon: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  description: string;

  @IsNotEmpty()
  @IsEnum(EnumContentNodeType)
  type: EnumContentNodeType;
}
