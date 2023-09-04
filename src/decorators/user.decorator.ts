import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRoute } from '../guards/auth.guard';

export const User = createParamDecorator(
  (userData: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedRoute>();
    const user = request.user;
    return userData ? user?.[userData] : user;
  },
);
