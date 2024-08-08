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
  ManyToOne,
} from 'typeorm';
import { TemplateCategoryEntity } from 'src/template-category/template-category.entity';

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

  @Column({ type: 'json', nullable: true, default: null })
  parameters: object;

  @OneToMany(() => ThreadEntity, (thread) => thread.template)
  @JoinColumn()
  threads: ThreadEntity[];

  @ManyToOne(
    () => TemplateCategoryEntity,
    (templateCategory) => templateCategory.templates,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  templateCategory: TemplateCategoryEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
