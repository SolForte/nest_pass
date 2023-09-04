import { Module, Global } from '@nestjs/common';
import { UsersModule } from '../users.module';
import { AuthController as AuthenticationController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [UsersModule],
  controllers: [AuthenticationController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthenticationModule {}
