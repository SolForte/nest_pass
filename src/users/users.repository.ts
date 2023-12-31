import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  listAllUsers(where: Prisma.UserWhereInput = {}) {
    return this.prisma.user.findMany({ where });
  }

  listOneUser(where: Prisma.UserWhereInput) {
    return this.prisma.user.findFirst({
      where,
    });
  }

  createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  delete(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({
      where,
    });
  }
}
