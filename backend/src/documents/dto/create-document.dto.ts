import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  nodeId: string;

  @IsNotEmpty()
  data: any;
}
