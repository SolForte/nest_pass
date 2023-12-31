import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOutDto } from './dto/signup.dto';
import { UsersService } from '../users.service';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { exclude } from '../../utils/prisma.utils';
import { DeleteDto } from '../dto/delete-user.dto';

export type JWTPayload = Pick<User, 'email' | 'id'>;

@Injectable()
export class AuthService {
  private ISSUER: string;
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.ISSUER = 'DRIVEN';
  }

  async logIn(signUpDto: SignOutDto) {
    const createdAcc = await this.userService.createNewUser(signUpDto);
    return exclude(createdAcc, 'password');
  }

  async logOut(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordValidation = await bcrypt.compare(password, user.password);

    if (!passwordValidation) {
      throw new UnauthorizedException();
    }

    return this.generateToken({ email: user.email, id: user.id });
  }

  private generateToken(payload: JWTPayload) {
    return {
      access_token: this.jwtService.sign(payload, {
        issuer: this.ISSUER,
      }),
    };
  }

  async tokenValidation(token: string) {
    return await this.jwtService.verifyAsync<JWTPayload>(token, {
      issuer: this.ISSUER,
    });
  }

  async deleteUser(user: JWTPayload, deleteDto: DeleteDto) {
    const { email, id } = user;
    const databaseUser = await this.userService.findUserByEmail(email);

    const validation = await bcrypt.compare(
      deleteDto.password,
      databaseUser.password,
    );

    if (!validation) {
      throw new UnauthorizedException();
    }
    const result = await this.userService.deleteUser(id);

    return exclude(result, 'password', 'createdAt', 'updatedAt');
  }
}
