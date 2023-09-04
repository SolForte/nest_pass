import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users.module';
import { AuthController as AuthenticationController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.SECRET,
      global: true,
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthenticationModule {}
