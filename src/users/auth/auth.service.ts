import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { UsersService } from '../users.service';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

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

  logIn(signUpDto: SignUpDto) {
    return this.userService.createUser(signUpDto);
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

  async validateToken(token: string) {
    return await this.jwtService.verifyAsync<JWTPayload>(token, {
      issuer: this.ISSUER,
    });
  }
}
