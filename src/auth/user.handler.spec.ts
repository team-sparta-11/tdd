import { Test, TestingModule } from '@nestjs/testing';
import { UserManager, UserReader } from './user.handler';
import { UserEntity } from './struct/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UserManager and UserReader', () => {
  let userRepository: Repository<UserEntity>;
  let userManager: UserManager;
  let userReader: UserReader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserManager,
        UserReader,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    userManager = module.get<UserManager>(UserManager);
    userReader = module.get<UserReader>(UserReader);
  });

  const userData = { email: 'test@example.com', password: 'test1234' };
  const createdUserData = { ...userData, id: 1, balance: 0 };

  it('shuld create an user', async () => {
    const createSpy = jest
      .spyOn(userRepository, 'create')
      .mockReturnValue(userData as UserEntity);

    const result = await userManager.create(userData);

    expect(createSpy).toHaveBeenCalledWith(userData);
    expect(result).toEqual(userData);
  });

  it('should create and save a user', async () => {
    const saveSpy = jest
      .spyOn(userRepository, 'save')
      .mockResolvedValue(createdUserData as UserEntity);

    const result = await userManager.save(userData);

    expect(saveSpy).toHaveBeenCalledWith(userData);
    expect(result).toEqual(createdUserData);
  });

  it('should find user by email', async () => {
    const email = 'test@example.com';

    const findSpy = jest
      .spyOn(userRepository, 'findOneBy')
      .mockResolvedValue(createdUserData as UserEntity);

    const result = await userReader.findOneByEmail(email);

    expect(findSpy).toHaveBeenCalledWith({ email });
    expect(result).toEqual(createdUserData);
  });
});
