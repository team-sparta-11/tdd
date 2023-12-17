import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserManager, UserReader } from './user.repository';
import { Repository } from 'typeorm';
import { User } from './user.domain';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { UserEntity } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userManager: UserManager;
  // @TODO: test other mehtods by UserReader
  let userReader: UserReader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: JwtService, useValue: jest.fn() },
        { provide: getRepositoryToken(UserEntity), useClass: Repository },
        AuthService,
        UserManager,
        UserReader,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userManager = module.get<UserManager>(UserManager);
    userReader = module.get<UserReader>(UserReader);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('createUser', () => {
    it('Should be create user if email and password is provided', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        email: 'test@example.com',
        password: 'testPassword',
      };

      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => 'mockedHash');

      jest
        .spyOn(userManager, 'create')
        .mockImplementation((user: User) => user);
      jest.spyOn(userManager, 'save').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'mockedHash',
        balance: 0,
      });

      const result = await authService.createUser(authCredentialsDto);

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        password: 'mockedHash',
        balance: 0,
      });

      expect(userManager.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'mockedHash',
      });
      expect(userManager.save).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'mockedHash',
      });
    });
  });
});
