/* eslint-disable @typescript-eslint/no-var-requires */
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
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.SECRET);
  }

  async createCard(createCardDto: CreateCardDto, user: JWTPayload) {
    try {
      const card = await this.cardsRepository.create({
        ...createCardDto,
        password: this.cryptr.encrypt(createCardDto.password),
        expirationDate: new Date(createCardDto.expirationDate),
        Author: {
          connect: {
            id: user.id,
          },
        },
      });

      return exclude(card, 'createdAt', 'updatedAt', 'password');
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException();
      }
    }
  }

  async findOneCard(id: number, userId: number) {
    const cards = await this.cardsRepository.listOne({ id });
    this.cardValidation(cards, userId);
    return {
      ...cards,
      password: this.cryptr.decrypt(cards.password),
    };
  }

  async findAll(id: number) {
    const cards = await this.cardsRepository.findAll({
      authorId: id,
    });
    if (cards.length === 0) {
      return cards;
    }
    const decryptedCards = cards.map((card) => ({
      ...card,
      password: this.cryptr.decrypt(card.password),
    }));
    return decryptedCards;
  }

  async removeCard(id: number, userId: number) {
    const card = await this.findOneCard(id, userId);
    return this.cardsRepository.remove(card.id);
  }

  private cardValidation(cards: CreditCard, userId: number) {
    if (!cards) {
      throw new NotFoundException();
    } else if (cards.authorId !== userId) {
      throw new ForbiddenException();
    }
  }
}
