import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { DateEntity } from './date.entity'; // DateAvailability Entity 모델 import

@Entity()
export class SeatEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DateEntity, (date) => date.seatAvailability)
  dateAvailability: DateEntity;

  @Column({ nullable: true })
  userId: number;

  @Column()
  seatNumber: number;

  @Column({ default: true })
  isAvailable: boolean;
}
