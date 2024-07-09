import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContestQuestionEntity } from './contest-question.entity';
import { ContestEntity } from './contest.entity';
import { QuizEntity } from './quiz.entity';

@Entity({ name: 'contest_quiz' })
export class ContestQuizEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Column()
  // quizId: number;

  @Column({ default: '' })
  name: string;

  @Column({ default: 1 })
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => QuizEntity, (entity) => entity.contestQuizzes, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  quiz: QuizEntity;

  @OneToMany(() => ContestQuestionEntity, (entity) => entity.contestQuiz)
  questions: ContestQuestionEntity[];

  @OneToMany(() => ContestEntity, (entity) => entity.contestQuiz)
  contests: ContestEntity[];
}
