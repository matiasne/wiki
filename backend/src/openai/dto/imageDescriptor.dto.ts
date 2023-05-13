import { IsNotEmpty, IsString } from 'class-validator';

export class ImageDescriptorDto {
  @IsNotEmpty()
  @IsString()
  url: string;
}
