import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AnswerEntity } from './answer.entity';
import { ContestEntity } from './contest.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'player' })
export class PlayerEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Column()
  // userId: number;

  // @Column()
  // contestId: number;

  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column()
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (entity) => entity.players, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  user: UserEntity | null;

  @ManyToOne(() => ContestEntity, (entity) => entity.players, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  contest: ContestEntity;

  @OneToMany(() => AnswerEntity, (entity) => entity.player)
  answers: AnswerEntity[];
}
