import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ name: 'email', example: 'email@example.com' })
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
  })
  @ApiProperty({ name: 'password', example: 'Password!1@2#3$4%5' })
  password: string;
}
