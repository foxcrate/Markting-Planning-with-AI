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
} from 'typeorm';
import { TacticEntity } from '../tactic/tactic.entity';
import { UserRoleEnum } from 'src/enums/user-roles.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

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

  @Column({ nullable: true })
  password: string;

  @Column({ default: 0 })
  credits: number;

  @Column({ nullable: true })
  forgetPasswordOtp: string;

  @Column()
  phoneNumber: string;

  @OneToMany(() => ThreadEntity, (thread) => thread.user)
  @JoinColumn()
  threads: ThreadEntity[];

  @OneToMany(() => FunnelEntity, (funnel) => funnel.user)
  @JoinColumn()
  funnels: FunnelEntity[];

  @OneToMany(() => WorkspaceEntity, (workspace) => workspace.user)
  @JoinColumn()
  workspaces: WorkspaceEntity[];

  @OneToMany(() => TacticEntity, (tactic) => tactic.user)
  @JoinColumn()
  tactics: TacticEntity[];

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
