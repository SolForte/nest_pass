import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { CardsRepository } from './card.repository';
import { JWTPayload } from '../users/auth/auth.service';
import { exclude } from '../utils/prisma.utils';
import Cryptr from 'cryptr';
import { CreditCard } from '@prisma/client';

@Injectable()
export class CardsService {
  private cryptr: Cryptr;
  constructor(private readonly cardsRepository: CardsRepository) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.JWT_SECRET);
  }

  async createCard(createCardDto: CreateCardDto, user: JWTPayload) {
    try {
      const result = await this.cardsRepository.createCard({
        ...createCardDto,
        password: this.cryptr.encrypt(createCardDto.password),
        expirationDate: new Date(createCardDto.expirationDate),
        Author: {
          connect: {
            id: user.id,
          },
        },
      });
      return exclude(result, 'createdAt', 'updatedAt', 'password');
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException();
      }
    }
  }

  async findOneCardById(id: number, userId: number) {
    const result = await this.cardsRepository.getSingleCard({ id });
    this.cardValidationFunction(result, userId);
    return {
      ...result,
      password: this.cryptr.decrypt(result.password),
    };
  }

  async getAllCards(id: number) {
    const cards = await this.cardsRepository.fetchAllCards({
      authorId: id,
    });
    //returns if no cards exist
    if (cards.length === 0) {
      return cards;
    }
    const result = cards.map((card) => ({
      ...card,
      password: this.cryptr.decrypt(card.password),
    }));
    return result;
  }

  async deleteCard(id: number, userId: number) {
    const card = await this.findOneCardById(id, userId);
    const result = await this.cardsRepository.deleteCardById(card.id);
    return exclude(result, 'password', 'secureCode', 'createdAt', 'updatedAt');
  }

  private cardValidationFunction(CreditCard: CreditCard, userId: number) {
    if (!CreditCard) {
      throw new NotFoundException();
    } else if (CreditCard.authorId !== userId) {
      throw new ForbiddenException();
    }
  }
}
