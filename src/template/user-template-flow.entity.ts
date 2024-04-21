import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { TemplateEntity } from './template.entity';
import { UserEntity } from '../user/user.entity';
import { MessageEntity } from '../message/message.entity';

@Entity({ name: 'user_template_flows' })
export class UserTemplateFlowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  current_step: number;

  @Column('text')
  lastSummarization: string;

  @ManyToOne(() => TemplateEntity, (template) => template.userTemplateFlows, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  template: TemplateEntity;

  @ManyToOne(() => UserEntity, (user) => user.userTemplateFlows, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @OneToMany(() => MessageEntity, (message) => message.userTemplateFlow)
  @JoinColumn()
  messages: MessageEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
