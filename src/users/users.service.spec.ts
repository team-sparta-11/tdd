import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';

import { User } from './entities/user.entity';

import { CreateAccessTokenDto } from './dto/create-access-token.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findOneByEmail', () => {
    const user: User = {
      userId: '12454CD8-A693-4AE2-9B47-9A980F38578A',
      email: 'dlqud19@gmail.com',
      password: '8757fab4a67c0bf9bc3b747bc42',
      hashPassword: () => undefined,
    };

    it('should get user by email', async () => {
      const email = 'dlqud19@gmail.com';

      jest
        .spyOn(usersRepository, 'findOne')
        .mockReturnValueOnce(Promise.resolve(user));

      const result = await usersService.findOneByEmail(email);

      expect(result).toEqual(user);
    });
  });

  describe('createAccessToken', () => {
    const user: User = {
      userId: '12454CD8-A693-4AE2-9B47-9A980F38578A',
      email: 'dlqud19@gmail.com',
      password: '8757fab4a67c0bf9bc3b747bc42',
      hashPassword: () => undefined,
    };

    const createAccessTokenDto: CreateAccessTokenDto = {
      userId: '34454CD8-A693-4AE2-9B47-9A980F38578A',
      email: 'dlqud19@gmail.com',
    };

    const accessToken = 'jZAgcfl7p92ldGxad68LJZdL17lhWy';

    it('can make access token', async () => {
      jest
        .spyOn(usersRepository, 'findOne')
        .mockReturnValueOnce(Promise.resolve(user));

      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => accessToken);

      const result = await usersService.createAccessToken(createAccessTokenDto);

      expect(result).toEqual(accessToken);
    });

    it('throw not found error when no user exist', async () => {
      jest.spyOn(usersRepository, 'findOne').mockReturnValue(undefined);

      await expect(
        usersService.createAccessToken(createAccessTokenDto),
      ).rejects.toThrow(new NotFoundException('user not found'));
    });
  });
});
