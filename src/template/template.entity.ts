import { ThreadEntity } from '../thread/thread.entity';
import { TemplateType } from '../enums/template-type.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserTemplateFlowEntity } from './user-template-flow.entity';

@Entity({ name: 'templates' })
export class TemplateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TemplateType,
    default: TemplateType.CUSTOM,
  })
  type: TemplateType;

  @Column({ nullable: true })
  openaiAssistantId: string;

  @Column()
  name: string;

  @Column('longtext')
  descriptions: string;

  @Column({ type: 'json' })
  flow: object;
  //parameters

  @OneToMany(() => ThreadEntity, (thread) => thread.template)
  @JoinColumn()
  threads: ThreadEntity[];

  @OneToMany(
    () => UserTemplateFlowEntity,
    (userTemplateFlow) => userTemplateFlow.template,
  )
  @JoinColumn()
  userTemplateFlows: UserTemplateFlowEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
