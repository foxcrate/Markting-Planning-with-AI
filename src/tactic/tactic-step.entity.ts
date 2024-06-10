import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { TacticEntity } from './tactic.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tactic_step' })
export class TacticStepEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ type: 'longtext' })
  description: string;

  @ApiProperty()
  @Column({ default: null })
  attachment: string;

  @ApiProperty()
  @Column()
  theOrder: number;

  @ManyToOne(() => TacticEntity, (tactic) => tactic.tacticSteps, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tactic: TacticEntity;

  // @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  // @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
