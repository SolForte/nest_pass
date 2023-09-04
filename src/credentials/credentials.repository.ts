import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CredentialsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createCredential(data: Prisma.CredentialCreateInput) {
    return this.prisma.credential.create({
      data,
    });
  }

  findAllCredentials(where: Prisma.CredentialWhereInput) {
    return this.prisma.credential.findMany({
      where,
    });
  }

  listOneCredential(where: Prisma.CredentialWhereInput) {
    return this.prisma.credential.findFirst({
      where,
    });
  }

  removeCredential(id: number) {
    return this.prisma.credential.delete({
      where: {
        id,
      },
    });
  }
}
