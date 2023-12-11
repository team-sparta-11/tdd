import { Injectable } from '@nestjs/common';
import { User } from './struct/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async register(body: User) {
    const user = this.repository.create(body);
    return this.repository.save(user);
  }
}
