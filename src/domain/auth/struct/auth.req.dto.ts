import { PickType } from '@nestjs/swagger';
import { User } from './user.entity';

export class AuthReqSignDto extends PickType(User, ['email', 'password']) {}
