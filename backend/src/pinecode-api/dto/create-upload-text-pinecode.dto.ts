import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUploadTextPinecodeDbDto {
  @IsNotEmpty()
  @IsString()
  text: string;
}
