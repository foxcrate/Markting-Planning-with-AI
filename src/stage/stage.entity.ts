import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { FunnelEntity } from '../funnel/funnel.entity';
import { TacticsStagesEntity } from './tactics-stages.entity';

@Entity({ name: 'stages' })
export class StageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'longtext' })
  description: string;

  @Column()
  theOrder: number;

  @ManyToOne(() => FunnelEntity, (funnel) => funnel.stages, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  funnel: FunnelEntity;

  @OneToMany(() => TacticsStagesEntity, (tacticsStages) => tacticsStages.stage)
  @JoinColumn()
  tacticsStages: TacticsStagesEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
