import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { KpiEntity } from 'src/kpi/kpi.entity';

@Entity({ name: 'kpi_entry' })
export class KpiEntryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column()
  date: Date;

  @ManyToOne(() => KpiEntity, (kpi) => kpi.kpiEntries, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  kpi: KpiEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
