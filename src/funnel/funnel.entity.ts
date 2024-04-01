import { UserEntity } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { StageEntity } from './stage.entity';

@Entity({ name: 'funnels' })
export class FunnelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.funnels, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @OneToMany(() => StageEntity, (stage) => stage.funnel)
  @JoinColumn()
  stages: StageEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
