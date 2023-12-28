import { Date } from 'src/date/struct/date.domain';

export interface Seat {
  id: number;
  userId: number;
  seatNumber: number;
  dateAvailability?: Date;
}
