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
  description: string;

  @Column({ type: 'json' })
  parameters: object;

  @OneToMany(() => ThreadEntity, (thread) => thread.template)
  @JoinColumn()
  threads: ThreadEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
