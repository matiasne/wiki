import { PartialType } from '@nestjs/mapped-types';
import { CreateChatterboxDto } from './create-chatterbox.dto';

export class UpdateChatterboxDto extends PartialType(CreateChatterboxDto) {}
