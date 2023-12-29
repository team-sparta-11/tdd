import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { DateEntity } from '../../date/struct/date.entity';

@Entity()
export class SeatEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column()
  seatNumber: number;

  @ManyToOne(() => DateEntity, (date) => date.seatAvailability)
  date: string;
}
