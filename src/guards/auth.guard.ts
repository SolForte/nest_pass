import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService, JWTPayload } from '../users/auth/auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRoute>();
    const { authorization } = request.headers;

    if (!authorization) {
      throw new UnauthorizedException('Invalid Token!');
    }

    const split = authorization.split(' ');

    if (split.length !== 2) {
      throw new UnauthorizedException('Invalid Token!');
    }

    const [schema, token] = split;

    if (schema !== 'Bearer') {
      throw new UnauthorizedException('Invalid Token!');
    }

    try {
      const data = await this.authService.validateToken(token);
      request.user = { email: data.email, id: data.id };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token!');
    }
  }
}

export type AuthenticatedRoute = Request & { user: JWTPayload };
