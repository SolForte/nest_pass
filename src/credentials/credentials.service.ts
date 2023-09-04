import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import { JWTPayload } from '../users/auth/auth.service';
import { exclude } from '../utils/prisma.utils';
import Cryptr from 'cryptr';
import { Credential } from '@prisma/client';

@Injectable()
export class CredentialsService {
  private cryptr: Cryptr;

  constructor(private readonly credentialsRepository: CredentialsRepository) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.JWT_SECRET);
  }

  async create(createCredentialDto: CreateCredentialDto, user: JWTPayload) {
    try {
      const result = await this.credentialsRepository.createCredential({
        ...createCredentialDto,
        password: this.cryptr.encrypt(createCredentialDto.password),
        Author: {
          connect: {
            id: user.id,
          },
        },
      });

      return exclude(result, 'createdAt', 'updatedAt', 'password');
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException();
      }
    }
  }

  async getOneCredential(id: number, userId: number) {
    const result = await this.credentialsRepository.getSingleCredential({
      id,
    });

    this.validCredentials(result, userId);

    return {
      ...result,
      password: this.cryptr.decrypt(result.password),
    };
  }

  async findAllCredentials(id: number) {
    const credentials = await this.credentialsRepository.findManyCredentials({
      authorId: id,
    });

    if (credentials.length === 0) {
      return credentials;
    }

    const result = credentials.map((credential) => ({
      ...credential,
      password: this.cryptr.decrypt(credential.password),
    }));

    return result;
  }

  async eraseCredential(id: number, userId: number) {
    const credential = await this.getOneCredential(id, userId);
    const result = await this.credentialsRepository.deleteCredential(
      credential.id,
    );
    return exclude(result, 'password', 'createdAt', 'updatedAt');
  }

  private validCredentials(credentials: Credential, userId: number) {
    if (!credentials) {
      throw new NotFoundException();
    }

    if (credentials.authorId !== userId) {
      throw new ForbiddenException();
    }
  }
}
