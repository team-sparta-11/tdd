import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './struct/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthReqSignDto } from './struct/auth.req.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(body: User) {
    const hash = await bcrypt.hash(body.password, 10);
    const user = this.repository.create({
      email: body.email,
      password: hash,
      nickName: body.nickName,
    });

    return this.repository.insert(user);
  }

  async sign(body: AuthReqSignDto) {
    const user = await this.repository.findOneByOrFail({
      email: body.email,
    });

    if (!(await bcrypt.compare(body.password, user.password)))
      throw new UnauthorizedException();

    return {
      accessToken: this.jwtService.sign({ id: user.id }, { expiresIn: '1d' }),
    };
  }
}
