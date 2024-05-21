import { UserEntity } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { FunnelEntity } from './funnel.entity';

@Entity({ name: 'stages' })
export class StageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  order: number;

  @ManyToOne(() => FunnelEntity, (funnel) => funnel.stages, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  funnel: FunnelEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
