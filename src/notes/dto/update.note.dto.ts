import { PartialType } from '@nestjs/mapped-types';
import { CreateNotesDto } from './create-note.dto';

export class UpdateNotesDTO extends PartialType(CreateNotesDto) {}
