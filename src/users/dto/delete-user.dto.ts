import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'password',
    description: 'Password!1@2#3$4%5',
  })
  password: string;
}
