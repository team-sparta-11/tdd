import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { DateEntity } from '../date/struct/date.entity';
import { SeatEntity } from '../seat/struct/seat.entity';

export default class CreateInitialData implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const date = currentDate.toISOString().split('T')[0];
      const dateRepository = dataSource.getRepository(DateEntity);
      const dateEntity = dateRepository.create({ date });

      const result = await dateRepository.save(dateEntity);

      for (let seatNumber = 1; seatNumber <= 50; seatNumber++) {
        const seatRepository = dataSource.getRepository(SeatEntity);
        const seatEntity = seatRepository.create({
          dateAvailability: dateEntity,
          seatNumber,
        });

        await seatRepository.save(seatEntity);
      }
    }
  }
}
