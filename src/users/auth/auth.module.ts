import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users.module';
import { AuthController as AuthenticationController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.SECRET,
      global: true,
      signOptions: {
        expiresIn: '4000',
      },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthService],
})
export class AuthenticationModule {}
