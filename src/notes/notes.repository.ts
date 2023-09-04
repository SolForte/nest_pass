import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  createNote(data: Prisma.NoteCreateInput) {
    return this.prisma.note.create({
      data,
    });
  }

  findManyNotes(where: Prisma.NoteWhereInput) {
    return this.prisma.note.findMany({
      where,
    });
  }

  findNoteById(where: Prisma.NoteWhereInput) {
    return this.prisma.note.findFirst({
      where,
    });
  }

  deleteNote(id: number) {
    return this.prisma.note.delete({
      where: {
        id,
      },
    });
  }
}
