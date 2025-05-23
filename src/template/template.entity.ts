import { ThreadEntity } from '../thread/thread.entity';
import { TemplateTypeEnum } from '../enums/template-type.enum';
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
import { DocumentEntity } from 'src/document/document.entity';

@Entity({ name: 'templates' })
export class TemplateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TemplateTypeEnum,
    default: TemplateTypeEnum.CUSTOM,
  })
  type: TemplateTypeEnum;

  @Column({ nullable: true })
  openaiAssistantId: string;

  @Column()
  name: string;

  @Column({ default: 400 })
  maxCharacters: number;

  @Column({ default: 1 })
  generatedDocumentsNum: number;

  @Column({ default: null })
  profilePicture: string;

  @Column('longtext')
  description: string;

  @Column('longtext', { nullable: true, default: null })
  example: string;

  @Column({ type: 'json', nullable: true, default: null })
  parameters: object;

  @Column({ type: 'json', nullable: true, default: null })
  requiredData: object;

  @OneToMany(() => ThreadEntity, (thread) => thread.template)
  @JoinColumn()
  threads: ThreadEntity[];

  @OneToMany(() => DocumentEntity, (document) => document.template)
  @JoinColumn()
  documents: DocumentEntity[];

  @ManyToOne(
    () => TemplateCategoryEntity,
    (templateCategory) => templateCategory.templates,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  category: TemplateCategoryEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
