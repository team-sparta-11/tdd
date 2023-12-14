import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { SeatEntity } from './seat.entity'; // SeatEntity Entity 모델 import

@Entity()
export class DateEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @OneToMany(() => SeatEntity, (seat) => seat.dateAvailability)
  seatAvailability: SeatEntity[];
}
