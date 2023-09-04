import {
  Controller,
  Post,
  Body,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService, JWTPayload } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../decorators/user.decorator';
import { DeleteDto } from '../dto/delete-user.dto';
import { AuthGuard } from '../../guards/auth.guard';

class SignInResponse {
  @ApiProperty({ name: 'acess_token', example: 'Bearer Token' })
  access_token: string;
}

@ApiTags('Users')
@Controller('users')
export class AuthController {
  constructor(private readonly authenticationService: AuthService) {}

  @Post('/sign-up')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid email or invalid password.',
  })
  @ApiBody({
    type: SignUpDto,
  })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authenticationService.logIn(signUpDto);
  }

  @HttpCode(200)
  @Post('/sign-in')
  @ApiOperation({ summary: 'Authenticate an user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    type: SignInResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Email or password does not match or does not exist.',
  })
  @ApiBody({
    type: SignUpDto,
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authenticationService.logOut(signInDto);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid password',
  })
  @ApiBody({
    type: DeleteDto,
  })
  @UseGuards(AuthGuard)
  @Delete('/erase')
  deleteUser(@User() user: JWTPayload, @Body() deleteDto: DeleteDto) {
    return this.authenticationService.deleteUser(user, deleteDto);
  }
}
