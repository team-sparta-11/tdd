import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthCredentialsDto } from './struct/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/types/auth';
import { UserManager, UserReader } from './user.handler';
import { User } from './struct/user.domain';

@Injectable()
export class AuthService {
  constructor(
    private readonly userReader: UserReader,
    private readonly userManager: UserManager,

    private jwtService: JwtService,
  ) {}

  async createUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<Omit<User, 'password'>> {
    const { email, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userManager.create({
      email,
      password: hashedPassword,
    });

    try {
      const { password: _, ...passwordOmittedUser } =
        await this.userManager.save(user);
      return passwordOmittedUser;
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
