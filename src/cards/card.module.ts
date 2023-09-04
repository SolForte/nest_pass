import { Module } from '@nestjs/common';
import { CardsService } from './card.service';
import { CardsController } from './cards.controller';
import { CardsRepository } from './card.repository';

@Module({
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
})
export class CardsModule {}
