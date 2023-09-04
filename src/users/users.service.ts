import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly GEN_SALT_SYNC = bcrypt.genSaltSync(10);

  constructor(private readonly userRepository: UserRepository) {}
  async createNewUser(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.createUser({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, this.GEN_SALT_SYNC),
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException();
      }
    }
  }

  findAll() {
    return `Returns all users`;
  }

  findOne(id: number) {
    return `Returns a #${id} user`;
  }

  findUserByEmail(email: string) {
    return this.userRepository.listOneUser({ email });
  }

  async deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }
}
