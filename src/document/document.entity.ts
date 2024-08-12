import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { TemplateEntity } from 'src/template/template.entity';
import { UserEntity } from 'src/user/user.entity';

@Entity({ name: 'documents' })
export class DocumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ type: 'json', nullable: true, default: null })
  requiredData: object;

  @Column({ type: 'longtext', nullable: true, default: null })
  aiResponse: string;

  @ManyToOne(() => TemplateEntity, (template) => template.documents, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  template: TemplateEntity;

  @ManyToOne(() => UserEntity, (user) => user.documents, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
