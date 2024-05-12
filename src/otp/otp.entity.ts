import { OtpTypes } from '../enums/otp-types.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'otps' })
export class OtpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNumber: string;

  @Column()
  otp: string;

  @Column({
    type: 'enum',
    enum: OtpTypes,
    nullable: true,
    default: null,
  })
  otpType: OtpTypes | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
