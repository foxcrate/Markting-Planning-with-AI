import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { TacticEntity } from './tactic.entity';

@Entity({ name: 'tactic_step' })
export class TacticStepEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'longtext' })
  description: string;

  @Column({ default: null })
  attachment: string;

  @Column()
  theOrder: number;

  @ManyToOne(() => TacticEntity, (tactic) => tactic.tacticSteps, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tactic: TacticEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
