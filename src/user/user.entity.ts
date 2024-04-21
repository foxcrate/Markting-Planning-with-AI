import { UserTemplateFlowEntity } from '../template/user-template-flow.entity';
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

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'boolean', default: false })
  phoneVerified: boolean;

  @Column({ nullable: true })
  forgetPasswordOtp: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToMany(() => ThreadEntity, (thread) => thread.user)
  @JoinColumn()
  threads: ThreadEntity[];

  @OneToMany(
    () => UserTemplateFlowEntity,
    (userTemplateFlow) => userTemplateFlow.user,
  )
  @JoinColumn()
  userTemplateFlows: UserTemplateFlowEntity[];

  @OneToMany(() => FunnelEntity, (funnel) => funnel.user)
  @JoinColumn()
  funnels: FunnelEntity[];

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
