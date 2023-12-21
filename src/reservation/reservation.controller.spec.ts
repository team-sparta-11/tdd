import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { SeatEntity } from 'src/seat/seat.entity';
import { User } from 'src/auth/struct/user.domain';
import { Reservation } from './reservation.domain';
import { RequestReservationDto } from './dto/request-reservation.dto';
import { PAYMENT_STATUS } from 'src/common/types/reservation';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [ReservationService, SeatEntity],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('requestReservation', () => {
    it('should make a reservation', async () => {
      const requestDto: RequestReservationDto = {
        seatNumber: 1,
        userId: 1,
        date: '2024-01-01',
      };
      const user: User = {
        id: 1,
        email: 'abc@abcd.com',
        password: 'test1234',
        balance: 100000,
      };

      const reservation: Reservation = {
        id: 1,
        userId: 1,
        date: '2024-01-01',
        seatNumber: 1,
        isExpired: false,
        paymentStatus: PAYMENT_STATUS.UNPAID,
      };
      jest.spyOn(service, 'requestReservation').mockResolvedValue(reservation);

      const result = await controller.requestReservation(requestDto, user);
      expect(result).toEqual(reservation);
    });
  });
});
