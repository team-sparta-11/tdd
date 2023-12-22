import { WaitingToken } from '../../common/types/waiting';

export const WaitingNotInTaskMock: WaitingToken = {
  rank: 1,
  token: 'someTokenMadeByUtil',
  inTask: false,
};

export const InTaskMock: WaitingToken = {
  rank: 0,
  token: 'someTokenMadeByUtil',
  inTask: true,
};
