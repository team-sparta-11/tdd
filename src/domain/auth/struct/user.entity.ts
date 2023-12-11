import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({ required: true, description: 'nickName' })
  nickName: string;

  @Column()
  @ApiProperty({ required: true, description: 'email' })
  email: string;

  @Column()
  @ApiProperty({ required: true, description: 'password' })
  password: string;
}
