import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ThreadEntity } from '../thread/thread.entity';
import { SenderRole } from '../enums/sender-role.enum';
import { UserTemplateFlowEntity } from '../template/user-template-flow.entity';

@Entity({ name: 'messages' })
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: SenderRole,
    nullable: true,
    default: null,
  })
  senderRole: SenderRole | null;

  @Column('longtext')
  content: string;

  @ManyToOne(() => ThreadEntity, (thread) => thread.messages, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  thread: ThreadEntity;

  @ManyToOne(
    () => UserTemplateFlowEntity,
    (userTemplateFlow) => userTemplateFlow.messages,
    {
      cascade: true,
      onDelete: 'SET NULL',
      nullable: true,
    },
  )
  userTemplateFlow: UserTemplateFlowEntity;

  @Column({ nullable: true })
  templateFlowStepNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
