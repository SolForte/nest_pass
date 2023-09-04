import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { CardsService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { JWTPayload } from '../users/auth/auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Cards')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create card for user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid body',
  })
  @ApiBody({
    description: 'Title and card description',
    type: CreateCardDto,
  })
  createCard(@Body() createCardDto: CreateCardDto, @User() user: JWTPayload) {
    return this.cardsService.createCard(createCardDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get cards from user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns ok with all cards from user',
  })
  findAllCards(@User('id') id: number) {
    return this.cardsService.getAllCards(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one card by param id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns ok with one card',
  })
  @ApiParam({ name: 'id', example: 1 })
  findOneCard(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.cardsService.findOneCardById(+paramId, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete card by param id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Deletes card and returns ok with the deleted card information',
  })
  @ApiParam({ name: 'id', example: 1 })
  removeCard(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.cardsService.deleteCard(+paramId, userId);
  }
}
