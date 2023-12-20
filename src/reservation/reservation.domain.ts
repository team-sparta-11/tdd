import { PAYMENT_STATUS } from 'src/common/types/reservation';

export interface Reservation {
  id: number;
  userId: string;
  date: string;
  seatNumber: string;
  isExpired: boolean;
  paymentStatus: PAYMENT_STATUS;
}
