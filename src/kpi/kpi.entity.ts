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
import { KpiMeasuringFrequencyEnum } from 'src/enums/kpi-measuring-frequency.enum';
import { TacticEntity } from 'src/tactic/tactic.entity';
import { KpiEntryEntity } from 'src/kpi/kpi-entry.entity';

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

  @OneToMany(() => KpiEntryEntity, (kpiEntry) => kpiEntry.kpi)
  @JoinColumn()
  kpiEntries: KpiEntryEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
