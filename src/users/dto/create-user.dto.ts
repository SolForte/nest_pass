import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
  })
  password: string;
}
