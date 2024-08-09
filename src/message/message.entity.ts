import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ThreadEntity } from '../thread/thread.entity';
import { SenderRoleEnum } from '../enums/sender-role.enum';

@Entity({ name: 'messages' })
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: SenderRoleEnum,
    nullable: true,
    default: null,
  })
  SenderRoleEnum: SenderRoleEnum | null;

  @Column('longtext')
  content: string;

  @ManyToOne(() => ThreadEntity, (thread) => thread.messages, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  thread: ThreadEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
