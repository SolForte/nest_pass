import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthenticationModule } from './users/auth/auth.module';
import { CredentialsModule } from './credentials/credentials.module';
import { CardsModule } from './cards/card.module';
import { NotesModule } from './notes/notes.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthenticationModule,
    PrismaModule,
    CredentialsModule,
    CardsModule,
    NotesModule,
    JwtModule.register({
      secret: process.env.SECRET,
      global: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
