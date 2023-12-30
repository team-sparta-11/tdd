import { PAYMENT_STATUS } from '../../common/types/reservation';
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
  status: PAYMENT_STATUS;
}
