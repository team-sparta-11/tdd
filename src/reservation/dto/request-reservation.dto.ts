import { IsString, IsNumber } from 'class-validator';

export class RequestReservationDto {
  @IsNumber()
  userId: number;

  @IsString()
  date: string;

  @IsNumber()
  seatNumber: number;
}
