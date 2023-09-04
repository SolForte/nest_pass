import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotesDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Title', description: 'note title' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    description: 'note description',
  })
  description: string;
}
