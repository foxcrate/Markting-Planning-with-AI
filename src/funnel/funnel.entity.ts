import { UserEntity } from '../user/user.entity';
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
import { StageEntity } from '../stage/stage.entity';
import { FlowEntity } from 'src/flow/flow.entity';

@Entity({ name: 'funnels' })
export class FunnelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'longtext' })
  description: string;

  @Column({ default: false })
  createdByAssistant: boolean;

  @ManyToOne(() => UserEntity, (user) => user.funnels, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @OneToMany(() => StageEntity, (stage) => stage.funnel)
  @JoinColumn()
  stages: StageEntity[];

  @OneToMany(() => FlowEntity, (flow) => flow.funnel)
  @JoinColumn()
  flows: FlowEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
