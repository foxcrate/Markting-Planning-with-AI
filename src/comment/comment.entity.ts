import { UserEntity } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { FlowEntity } from 'src/flow/flow.entity';

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => FlowEntity, (flow) => flow.comments, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  flow: FlowEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
