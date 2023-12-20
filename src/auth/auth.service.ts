import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthCredentialsDto } from './struct/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { UserManager, UserReader } from './user.handler';
import { User } from './struct/user.domain';
import { JwtPayload } from '../common/types/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly userReader: UserReader,
    private readonly userManager: UserManager,

    private jwtService: JwtService,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { email, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userManager.create({
      email,
      password: hashedPassword,
    });

    try {
      return await this.userManager.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Sign up failed');
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;

    const user = await this.userReader.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };

      return { accessToken: this.jwtService.sign(payload) };
    } else {
      throw new UnauthorizedException('Login failed');
    }
  }
}
