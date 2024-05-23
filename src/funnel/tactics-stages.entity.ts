import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TacticEntity } from '../tactic/tactic.entity';
import { StageEntity } from './stage.entity';

@Entity({ name: 'tactics_stages' })
export class TacticsStagesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TacticEntity, (tactic) => tactic.tacticsStages, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tactic: TacticEntity;

  @ManyToOne(() => StageEntity, (stage) => stage.tacticsStages, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  stage: StageEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
