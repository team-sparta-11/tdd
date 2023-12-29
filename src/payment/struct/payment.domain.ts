import { PAYMENT_STATUS } from 'src/common/types/reservation';

export interface Payment {
  id: number;
  userId: number;
  amount: number;
  paymentDate: string;
  status: PAYMENT_STATUS;
}
