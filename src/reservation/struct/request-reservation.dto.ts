import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestReservationDto {
  @ApiProperty({ required: true, example: '2024-01-01' })
  @IsString()
  date: string;

  @ApiProperty({ required: true, example: 1 })
  @IsNumber()
  seatNumber: number;
}
