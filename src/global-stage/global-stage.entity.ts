import { TacticEntity } from '../tactic/tactic.entity';
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

@Entity({ name: 'global_stages' })
export class GlobalStageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'longtext' })
  description: string;

  @Column()
  theOrder: number;

  @OneToMany(() => TacticEntity, (tactic) => tactic.globalStage)
  @JoinColumn()
  tactics: TacticEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
