import { User } from '../struct/user.entity';
import * as bcrypt from 'bcrypt';

export const userMock: Omit<User, 'id' | 'hashPassword'> = {
  nickName: 'john dough',
  email: 'j@k.com',
  password: '1111',
};

export const storedUserMock: User = {
  ...userMock,
  id: 1,
  password: bcrypt.hashSync(userMock.password, 10),
  hashPassword: async () => {},
};
