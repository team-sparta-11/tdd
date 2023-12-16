import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { DateEntity } from '../seat/date.entity';
import { SeatEntity } from '../seat/seat.entity';

export default class CreateInitialData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const date = currentDate.toISOString().split('T')[0];
      const dateRepository = connection.getRepository(DateEntity);
      const dateEntity = dateRepository.create({ date });

      await dateRepository.save(dateEntity);

      for (let seatNumber = 1; seatNumber <= 50; seatNumber++) {
        const seatRepository = connection.getRepository(SeatEntity);
        const seatEntity = seatRepository.create({
          dateAvailability: dateEntity,
          seatNumber,
          isAvailable: true,
        });

        await seatRepository.save(seatEntity);
      }
    }
  }
}
