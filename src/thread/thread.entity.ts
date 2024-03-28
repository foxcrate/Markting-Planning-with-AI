import { MessageEntity } from '../message/message.entity';
import { UserEntity } from '../user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
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

  @OneToOne(() => UserEntity, (user) => user.thread)
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
