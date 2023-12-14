import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  amount: number;

  @Column()
  paymentDate: string;

  @Column()
  status: string;

  @Column()
  seatReservationId: number;
}
