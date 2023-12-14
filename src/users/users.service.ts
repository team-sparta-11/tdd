import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { CreateAccessTokenDto } from './dto/create-access-token.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.usersRepository.insert(createUserDto);
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    return user;
  }

  async createAccessToken(createAccessToken: CreateAccessTokenDto) {
    const { userId } = createAccessToken;
    const user = this.usersRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const payloadJson = JSON.stringify(createAccessToken);
    const accessToken = await bcrypt.hash(payloadJson, 10);

    return accessToken;
  }
}
