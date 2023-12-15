import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { User } from './struct/user.entity';
import { storedUserMock, userMock } from './__mocks__/user.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
        JwtService,
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be registered', async () => {
    jest.spyOn(repository, 'create').mockReturnValueOnce(userMock as User);
    jest.spyOn(repository, 'insert').mockImplementationOnce(() => null);

    await service.register(userMock as User);

    expect(repository.create).toHaveBeenCalled();
    expect(repository.insert).toHaveBeenCalled();
  });

  it('should be signed', async () => {
    jest
      .spyOn(repository, 'findOneByOrFail')
      .mockImplementationOnce(async () => storedUserMock);
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true);
    jest.spyOn(jwtService, 'sign').mockImplementationOnce(() => '');

    await service.sign(userMock as User);

    expect(bcrypt.compare).toHaveBeenCalled();
    expect(repository.findOneByOrFail).toHaveBeenCalled();
    expect(jwtService.sign).toHaveBeenCalled();
  });

  it('should be throw, when not match password', async () => {
    jest
      .spyOn(repository, 'findOneByOrFail')
      .mockImplementationOnce(async () => storedUserMock);
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);

    const failedMock = { ...userMock, password: '1112' };

    expect(service.sign(failedMock as User))
      .rejects.toThrow(new UnauthorizedException())
      .then(() => {
        expect(bcrypt.compare).toHaveBeenCalled();
        expect(repository.findOneByOrFail).toHaveBeenCalled();
      });
  });
});
