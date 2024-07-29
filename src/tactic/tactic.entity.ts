import { GlobalStageEntity } from '../global-stage/global-stage.entity';
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
import { TacticStepEntity } from './tactic-step.entity';
import { TacticsStagesEntity } from '../stage/tactics-stages.entity';
import { UserEntity } from '../user/user.entity';
import { KpiEntity } from 'src/kpi/kpi.entity';

@Entity({ name: 'tactics' })
export class TacticEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'longtext', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  private: boolean;

  @Column({ type: 'boolean', default: false })
  instance: boolean;

  @Column({ type: 'boolean', default: false })
  checked: boolean;

  @OneToMany(() => KpiEntity, (kpi) => kpi.tactic)
  @JoinColumn()
  kpis: KpiEntity[];

  @ManyToOne(() => GlobalStageEntity, (globalStage) => globalStage.tactics, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  globalStage: GlobalStageEntity;

  @OneToMany(() => TacticStepEntity, (tacticStep) => tacticStep.tactic)
  @JoinColumn()
  tacticSteps: TacticStepEntity[];

  @OneToMany(() => TacticsStagesEntity, (tacticsStages) => tacticsStages.tactic)
  @JoinColumn()
  tacticsStages: TacticsStagesEntity[];

  @ManyToOne(() => UserEntity, (user) => user.tactics, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
