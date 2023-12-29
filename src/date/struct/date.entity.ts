import { Entity, OneToMany, BaseEntity, PrimaryColumn } from 'typeorm';
import { SeatEntity } from '../../seat/struct/seat.entity';

@Entity()
export class DateEntity extends BaseEntity {
  @PrimaryColumn()
  date: string;

  @OneToMany(() => SeatEntity, (seat) => seat.date)
  seatAvailability: SeatEntity[];
}
