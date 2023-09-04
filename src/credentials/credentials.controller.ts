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
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @User() user: JWTPayload,
  ) {
    return this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all credentials by userId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns ok with all credentials from user id',
  })
  findAll(@User('id') id: number) {
    return this.credentialsService.findAllCredentials(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one credential by param id (userId)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns ok with one credential',
  })
  @ApiParam({ name: 'id', example: 1 })
  findOne(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.credentialsService.findOneCredential(+paramId, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one credential by param id (userId)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deletes credential and returns ok',
  })
  @ApiParam({ name: 'id', example: 1 })
  remove(
    @Param('id', ParseIntPipe) paramId: string,
    @User('id') userId: number,
  ) {
    return this.credentialsService.removeCredential(+paramId, userId);
  }
}
