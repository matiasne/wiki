import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  parentId: string;

  @IsString()
  data: any;
}
