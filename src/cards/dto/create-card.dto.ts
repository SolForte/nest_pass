import { ApiProperty } from '@nestjs/swagger';
import { CardType } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Title', description: 'card title' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '1234-5678-9012-3456', description: 'card number' })
  number: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Card', description: 'card name' })
  name: string;

  @IsDateString()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-01-02',
    description: 'expiration date for card',
  })
  expirationDate: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123', description: 'security code for card' })
  secureCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Password!1@2#3$4%5',
    description: 'password for card',
  })
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: 'true', description: 'if card is virtual or not' })
  isVirtual: boolean;

  @IsNotEmpty()
  @IsString()
  @IsEnum(CardType)
  @ApiProperty({ enum: CardType })
  type: CardType;
}
