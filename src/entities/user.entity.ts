import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContestEntity } from './contest.entity';
import { PlayerEntity } from './player.entity';
import { QuizEntity } from './quiz.entity';
import { EUserRole, EUserStatus } from '../common/enums/entity.enum';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @Column({ default: EUserStatus.Inactive })
  status: EUserStatus;

  @Column({ default: EUserRole.User })
  role: EUserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => QuizEntity, (entity) => entity.user)
  quizzes: QuizEntity[];

  @OneToMany(() => ContestEntity, (entity) => entity.user)
  contests: ContestEntity[];

  @OneToMany(() => PlayerEntity, (entity) => entity.user)
  players: PlayerEntity[];
}
