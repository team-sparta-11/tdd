import { PAYMENT_STATUS } from 'src/types/reservation';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class ReservationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  date: string;

  @Column()
  seatNumber: string;

  @Column()
  isExpired: boolean;

  @Column()
  paymentStatus: PAYMENT_STATUS;
}
