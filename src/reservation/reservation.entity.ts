import { PAYMENT_STATUS } from 'src/common/types/reservation';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class ReservationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  date: string;

  @Column()
  seatNumber: number;

  @Column()
  isExpired: boolean;

  @Column()
  paymentStatus: PAYMENT_STATUS;
}
