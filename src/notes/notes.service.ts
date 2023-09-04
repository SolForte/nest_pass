import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateNotesDto } from './dto/create-note.dto';
import { NotesRepository } from './notes.repository';
import { JWTPayload } from '../users/auth/auth.service';
import { exclude } from '../utils/prisma.utils';
import { Note } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async createNewNote(createNotesDto: CreateNotesDto, user: JWTPayload) {
    try {
      const note = await this.notesRepository.createNote({
        ...createNotesDto,
        Author: {
          connect: {
            id: user.id,
          },
        },
      });

      return exclude(note, 'createdAt', 'updatedAt');
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException();
      }
    }
  }

  async getNoteById(id: number, userId: number) {
    const result = await this.notesRepository.findNoteById({ id });

    this.noteValidation(result, userId);

    return result;
  }

  async fetchAllNotes(id: number) {
    const result = await this.notesRepository.findManyNotes({
      authorId: id,
    });

    if (result.length === 0) {
      return result;
    }

    return result;
  }

  async eraseNote(id: number, userId: number) {
    const note = await this.getNoteById(id, userId);
    const result = await this.notesRepository.deleteNote(note.id);
    return exclude(result, 'updatedAt', 'createdAt', 'description');
  }

  private noteValidation(note: Note, userId: number) {
    if (!note) {
      throw new NotFoundException();
    } else if (note.authorId !== userId) {
      throw new ForbiddenException();
    }
  }
}
