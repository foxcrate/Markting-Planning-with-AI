import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { KpiMeasuringFrequencyEnum } from 'src/enums/kpi-measuring-frequency.enum';
import { TacticEntity } from 'src/tactic/tactic.entity';

@Entity({ name: 'kpis' })
export class KpiEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  unit: string;

  @Column({
    type: 'enum',
    enum: KpiMeasuringFrequencyEnum,
    nullable: true,
    default: null,
  })
  kpiMeasuringFrequency: KpiMeasuringFrequencyEnum | null;

  @ManyToOne(() => TacticEntity, (tactic) => tactic.kpis, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tactic: TacticEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
