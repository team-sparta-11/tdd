import { PAYMENT_STATUS } from 'src/common/types/reservation';

export interface Reservation {
  id: number;
  userId: number;
  date: string;
  seatNumber: number;
  isExpired: boolean;
  paymentStatus: PAYMENT_STATUS;
}
