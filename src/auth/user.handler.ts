import { InjectRepository } from '@nestjs/typeorm';
import { User } from './struct/user.domain';
import { UserEntity } from './struct/user.entity';
import { DeepPartial, Repository } from 'typeorm';

interface Command<T> {
  create(user: T): DeepPartial<T>;
  save(user: T): Promise<T>;
}

export class UserManager implements Command<User> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(user: DeepPartial<User>): DeepPartial<User> {
    return this.userRepository.create(user);
  }

  async save(user: DeepPartial<User>): Promise<User> {
    return this.userRepository.save(user);
  }
}

interface Query<T> {
  findOneByEmail(email: User['email']): Promise<T | undefined>;
}

export class UserReader implements Query<User> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneByEmail(email: User['email']): Promise<User | undefined> {
    return this.userRepository.findOneBy({ email });
  }
}
