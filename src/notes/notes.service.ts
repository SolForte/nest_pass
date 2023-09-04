/* eslint-disable @typescript-eslint/no-var-requires */
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

  async createNote(createNotesDto: CreateNotesDto, user: JWTPayload) {
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
      if (error.code === 'P2002') throw new ConflictException();
    }
  }

  async findOneNote(id: number, userId: number) {
    const notes = await this.notesRepository.listOneNote({ id });

    this.noteValidation(notes, userId);

    return notes;
  }

  async findAllNotes(id: number) {
    const notes = await this.notesRepository.findAllNotes({
      authorId: id,
    });

    if (notes.length === 0) return notes;

    return notes;
  }

  async removeNote(id: number, userId: number) {
    const note = await this.findOneNote(id, userId);
    const removedNotes = await this.notesRepository.removeNote(note.id);
    return exclude(removedNotes, 'updatedAt', 'createdAt', 'description');
  }

  private noteValidation(notes: Note, userId: number) {
    if (!notes) {
      throw new NotFoundException();
    } else if (notes.authorId !== userId) {
      throw new ForbiddenException();
    }
  }
}
