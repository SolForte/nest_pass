import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createCard(data: Prisma.CreditCardCreateInput) {
    return this.prisma.creditCard.create({
      data,
    });
  }

  fetchAllCards(where: Prisma.CreditCardWhereInput) {
    return this.prisma.creditCard.findMany({
      where,
    });
  }

  getSingleCard(where: Prisma.CreditCardWhereInput) {
    return this.prisma.creditCard.findFirst({
      where,
    });
  }

  deleteCardById(id: number) {
    return this.prisma.creditCard.delete({
      where: {
        id,
      },
    });
  }
}
