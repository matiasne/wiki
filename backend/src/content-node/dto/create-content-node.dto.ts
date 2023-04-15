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

  @IsNotEmpty()
  @IsString()
  order: string;

  @IsString()
  data: string;

  @IsNotEmpty()
  @IsString()
  icon: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(EnumContentNodeType)
  type: EnumContentNodeType;
}
