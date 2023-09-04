import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNotesDto } from './dto/create-note.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { JWTPayload } from '../users/auth/auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note for user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid body',
  })
  @ApiBody({
    description: 'Receive title and description',
    type: CreateNotesDto,
  })
  postNote(@Body() createNotesDto: CreateNotesDto, @User() user: JWTPayload) {
    return this.notesService.createNewNote(createNotesDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes from user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns ok with all notes from user',
  })
  getAllNotes(@User('id') id: number) {
    return this.notesService.fetchAllNotes(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one note by param id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns ok with one note by param id',
  })
  @ApiParam({ name: 'id', example: 1 })
  getOneNoteById(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.notesService.getNoteById(+paramId, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one note by param id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deletes note and returns ok with deleted note information',
  })
  @ApiParam({ name: 'id', example: 1 })
  deleteNote(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.notesService.eraseNote(+paramId, userId);
  }
}
