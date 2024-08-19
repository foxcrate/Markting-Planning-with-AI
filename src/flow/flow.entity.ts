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
import { CommentEntity } from 'src/comment/comment.entity';
import { FunnelEntity } from 'src/funnel/funnel.entity';

@Entity({ name: 'flows' })
export class FlowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'longtext' })
  description: string;

  @Column({ type: 'json', nullable: true, default: null })
  steps: object;

  @ManyToOne(() => UserEntity, (user) => user.flows, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => FunnelEntity, (funnel) => funnel.flows, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  funnel: FunnelEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.flow)
  @JoinColumn()
  comments: CommentEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
