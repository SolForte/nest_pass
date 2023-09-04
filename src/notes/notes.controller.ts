import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNotesDto } from './dto/create-note.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { JWTPayload } from '../users/auth/auth.service';
import { ApiBody } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiBody({
    description: 'Receive title and description to create notes',
  })
  createNote(@Body() createNotesDto: CreateNotesDto, @User() user: JWTPayload) {
    return this.notesService.createNote(createNotesDto, user);
  }

  @Get()
  findAllNotes(@User('id') id: number) {
    return this.notesService.findAllNotes(id);
  }

  @Get(':id')
  findOneNote(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.notesService.findOneNote(+paramId, userId);
  }

  @Delete(':id')
  removeNote(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.notesService.removeNote(+paramId, userId);
  }
}
