import { UserEntity } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'workspaces' })
export class WorkspaceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'longtext', nullable: true })
  goal: string;

  @Column({ nullable: true })
  budget: string;

  @Column({ nullable: true })
  targetGroup: string;

  @Column({ nullable: true })
  marketingLevel: string;

  @Column({ default: false })
  confirmed: boolean;

  @ManyToOne(() => UserEntity, (user) => user.workspaces, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
