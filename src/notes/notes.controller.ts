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
  @ApiOperation({ summary: 'Create notes for user' })
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
  createNote(@Body() createNotesDto: CreateNotesDto, @User() user: JWTPayload) {
    return this.notesService.createNote(createNotesDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes by userId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns ok with all notes from userId',
  })
  findAllNotes(@User('id') id: number) {
    return this.notesService.findAllNotes(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one note by param id (userId)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns ok with one note',
  })
  @ApiParam({ name: 'id', example: 1 })
  findOneNote(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.notesService.findOneNote(+paramId, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one note by param id (userId)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deletes note and returns ok',
  })
  @ApiParam({ name: 'id', example: 1 })
  removeNote(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.notesService.removeNote(+paramId, userId);
  }
}
