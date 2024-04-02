import { MessageEntity } from '../message/message.entity';
import { UserEntity } from '../user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'threads' })
export class ThreadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  openAiId: string;

  @OneToMany(() => MessageEntity, (message) => message.thread)
  @JoinColumn()
  messages: MessageEntity[];

  @ManyToOne(() => UserEntity, (user) => user.threads, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
