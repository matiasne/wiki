import { PartialType } from '@nestjs/mapped-types';
import { CreateContentNodeDto } from './create-content-node.dto';

export class UpdateContentNodeDto extends PartialType(CreateContentNodeDto) {}
