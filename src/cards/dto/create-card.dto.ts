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
  @ApiProperty({ example: 'My Credit Card', description: 'Title of the card' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '4220616183574887',
    description: 'Card number',
  })
  number: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Visa (Brazil)', description: 'Card name' })
  name: string;

  @IsDateString()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2028-06-03',
    description: 'Card expiry date',
  })
  expirationDate: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '210', description: 'Card CVC/Security Code' })
  secureCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Password!1@2#3$4%5',
    description: 'Card password',
  })
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: 'Booloean which describes if card is virtual or not',
  })
  isVirtual: boolean;

  @IsNotEmpty()
  @IsString()
  @IsEnum(CardType)
  @ApiProperty({ enum: CardType })
  type: CardType;
}
