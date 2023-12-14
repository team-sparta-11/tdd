import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  chargeBalance({ user, amount }) {
    const currentBalance = user.balance;

    const newBalance = currentBalance + amount;

    const newUser = {
      ...user,
      balance: newBalance,
    };

    this.userRepository.save(newUser);

    return newBalance;
  }
}
