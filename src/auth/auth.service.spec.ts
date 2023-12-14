import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,

        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('should be signup in if email and password is provided', async () => {
      const user: User = {
        userId: '12454CD8-A693-4AE2-9B47-9A980F38578A',
        email: 'dlqud19@gmail.com',
        password: '1234',
        hashPassword: () => undefined,
      };

      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockReturnValueOnce(Promise.resolve(undefined));

      const usersCreateSpy = jest.spyOn(usersService, 'create');

      await authService.signUp(user.email, user.password);

      expect(usersCreateSpy).toHaveBeenCalledWith({
        email: user.email,
        password: user.password,
      });
    });

    it('should be error when email is already exsit', async () => {
      const user: User = {
        userId: '12454CD8-A693-4AE2-9B47-9A980F38578A',
        email: 'dlqud19@gmail.com',
        password: '1234',
        hashPassword: () => undefined,
      };

      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockReturnValueOnce(Promise.resolve(user));

      await expect(
        authService.signUp(user.email, user.password),
      ).rejects.toThrow(new ConflictException('email already exist'));
    });
  });

  describe('signIn', () => {
    it('should be sign in if email and password is correct', async () => {
      const user: User = {
        userId: '12454CD8-A693-4AE2-9B47-9A980F38578A',
        email: 'dlqud19@gmail.com',
        password: '1234',
        hashPassword: () => undefined,
      };

      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockReturnValueOnce(Promise.resolve(user));

      jest
        .spyOn(jwtService, 'signAsync')
        .mockReturnValueOnce(
          Promise.resolve('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'),
        );

      const result = await authService.signIn(user.email, user.password);

      expect(result).toEqual({
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      });
    });

    it('should be error when password is not correct', async () => {
      const user: User = {
        userId: '12454CD8-A693-4AE2-9B47-9A980F38578A',
        email: 'dlqud19@gmail.com',
        password: '1234',
        hashPassword: () => undefined,
      };

      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockReturnValueOnce(Promise.resolve(user));

      await expect(authService.signIn(user.email, '4321')).rejects.toThrow(
        new UnauthorizedException(),
      );
    });
  });
});
