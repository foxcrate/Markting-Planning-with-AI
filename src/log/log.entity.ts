import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { LogEntityEnum } from 'src/enums/log-entity.enum';
import { LogOperationEnum } from 'src/enums/log-operation.enum';
import { UserEntity } from 'src/user/user.entity';

@Entity({ name: 'logs' })
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: LogEntityEnum,
    nullable: false,
  })
  entity: LogEntityEnum;

  @Column()
  entityId: number;

  @Column({
    type: 'enum',
    enum: LogOperationEnum,
    nullable: false,
  })
  operation: LogOperationEnum;

  @Column()
  adminId: number;

  @ManyToOne(() => UserEntity, (user) => user.logs, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: UserEntity;

  @Column({ type: 'json', nullable: true, default: null })
  oldObject: object;

  @Column({ type: 'json', nullable: true, default: null })
  newObject: object;

  @Column({ type: 'json', nullable: true, default: null })
  changesObject: object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
