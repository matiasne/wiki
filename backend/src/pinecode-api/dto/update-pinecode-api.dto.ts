import { PartialType } from '@nestjs/mapped-types';
import { CreatePinecodeApiDto } from './create-pinecode-api.dto';

export class UpdatePinecodeApiDto extends PartialType(CreatePinecodeApiDto) {}
