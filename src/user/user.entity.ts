import { WorkspaceEntity } from '../workspace/workspace.entity';
import { FunnelEntity } from '../funnel/funnel.entity';
import { ThreadEntity } from '../thread/thread.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { TacticEntity } from '../tactic/tactic.entity';
import { UserRoleEnum } from 'src/enums/user-roles.enum';
import { DocumentEntity } from 'src/document/document.entity';
import { FlowEntity } from 'src/flow/flow.entity';
import { CommentEntity } from 'src/comment/comment.entity';
import { RoleEntity } from 'src/role/role.entity';
import { LogEntity } from 'src/log/log.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: false })
  blocked: boolean;

  @Column({ default: false })
  finishStartCoins: boolean;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.CUSTOMER,
  })
  type: UserRoleEnum;

  @Column({ nullable: true })
  authEmail: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ default: 0 })
  credits: number;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true, default: null })
  stripeCustomerId: string;

  @Column({ nullable: true, default: null })
  roleId: number | null;

  @ManyToOne(() => RoleEntity, (role) => role.users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @OneToMany(() => ThreadEntity, (thread) => thread.user)
  @JoinColumn()
  threads: ThreadEntity[];

  @OneToMany(() => LogEntity, (log) => log.admin)
  @JoinColumn()
  logs: LogEntity[];

  @OneToMany(() => FunnelEntity, (funnel) => funnel.user)
  @JoinColumn()
  funnels: FunnelEntity[];

  @OneToMany(() => FlowEntity, (flow) => flow.user)
  @JoinColumn()
  flows: FlowEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  @JoinColumn()
  comments: CommentEntity[];

  @OneToMany(() => WorkspaceEntity, (workspace) => workspace.user)
  @JoinColumn()
  workspaces: WorkspaceEntity[];

  @OneToMany(() => TacticEntity, (tactic) => tactic.user)
  @JoinColumn()
  tactics: TacticEntity[];

  @OneToMany(() => DocumentEntity, (document) => document.user)
  @JoinColumn()
  documents: DocumentEntity[];

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
