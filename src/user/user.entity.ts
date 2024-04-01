import { FunnelEntity } from '../funnel/funnel.entity';
import { ThreadEntity } from '../thread/thread.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  forgetPasswordOtp: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToOne(() => ThreadEntity, (thread) => thread.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  thread: ThreadEntity;

  @OneToMany(() => FunnelEntity, (funnel) => funnel.user)
  @JoinColumn()
  funnels: FunnelEntity[];

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
