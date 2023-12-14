import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { DateEntity } from '../seat/date.entity';
import { SeatEntity } from '../seat/seat.entity';

export default class CreateInitialData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // 2024년 1월의 시작 날짜와 마지막 날짜
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const date = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식의 날짜 문자열

      const dateRepository = connection.getRepository(DateEntity);

      const dateEntity = dateRepository.create({ date });

      await dateRepository.save(dateEntity);

      // 1부터 50까지의 좌석 생성
      for (let seatNumber = 1; seatNumber <= 50; seatNumber++) {
        const seatRepository = connection.getRepository(SeatEntity);

        const seatEntity = seatRepository.create({
          dateAvailability: dateEntity,
          seatNumber,
          isAvailable: true, // 초기에 모든 좌석을 예약 가능하도록 설정
        });

        await seatRepository.save(seatEntity);
      }
    }
  }
}
