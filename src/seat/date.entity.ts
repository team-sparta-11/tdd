import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { SeatEntity } from './seat.entity';

@Entity()
export class DateEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @OneToMany(() => SeatEntity, (seat) => seat.dateAvailability)
  seatAvailability: SeatEntity[];
}
