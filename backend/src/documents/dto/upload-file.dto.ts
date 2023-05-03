import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @IsString()
  parentId: string;

  @IsString()
  data: any;
}
