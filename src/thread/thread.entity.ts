import { TemplateEntity } from '../template/template.entity';
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

  @Column({ default: false })
  finishTemplate: boolean;

  @OneToMany(() => MessageEntity, (message) => message.thread)
  @JoinColumn()
  messages: MessageEntity[];

  @ManyToOne(() => UserEntity, (user) => user.threads, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => TemplateEntity, (template) => template.threads, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  template: TemplateEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
