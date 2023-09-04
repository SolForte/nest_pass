import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CardsService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { JWTPayload } from '../users/auth/auth.service';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  createCard(@Body() createCardDto: CreateCardDto, @User() user: JWTPayload) {
    return this.cardsService.createCard(createCardDto, user);
  }

  @Get()
  findAllCards(@User('id') id: number) {
    return this.cardsService.findAll(+id);
  }

  @Get(':id')
  findOneCard(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.cardsService.findOneCard(+paramId, userId);
  }

  @Delete(':id')
  removeCard(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.cardsService.removeCard(+paramId, userId);
  }
}
