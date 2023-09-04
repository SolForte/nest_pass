import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard as AuthenticationGuard } from './guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthenticationGuard)
  @Get('/health')
  getHello(): string {
    return this.appService.getHello();
  }
}
