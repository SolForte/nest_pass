import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { JWTPayload } from '../users/auth/auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Credentials')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @ApiBody({
    description: 'Receives title, username, description and password',
    type: CreateCredentialDto,
  })
  createCredentials(
    @Body() createCredentialDto: CreateCredentialDto,
    @User() user: JWTPayload,
  ) {
    return this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all credentials from user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns ok with all credentials from user',
  })
  getAllCredentials(@User('id') id: number) {
    return this.credentialsService.findAllCredentials(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one credential by param id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns ok with one credential from user',
  })
  @ApiParam({ name: 'id', example: 1 })
  findOneCredential(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.credentialsService.getOneCredential(+paramId, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one credential by param id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Deletes credential and returns ok with deleted credential information',
  })
  @ApiParam({ name: 'id', example: 1 })
  removeCredential(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.credentialsService.eraseCredential(+paramId, userId);
  }
}
