import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContestQuizEntity } from './contest-quiz.entity';
import { PlayerEntity } from './player.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'contest' })
export class ContestEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Column()
  // userId: number;

  // @Column()
  // contestQuizId: number;

  @Column()
  name: string;

  // @Column()
  // contestType: EContestType;

  @Column()
  startedAt: Date;

  @Column()
  endedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (entity) => entity.contests, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => ContestQuizEntity, (entity) => entity.contests, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  contestQuiz: ContestQuizEntity;

  @OneToMany(() => PlayerEntity, (entity) => entity.contest)
  players: PlayerEntity[];
}
