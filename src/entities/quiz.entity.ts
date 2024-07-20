import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EQuizStatus, EQuizVisibility } from '../common/enums/entity.enum';
import { CategoryEntity } from './category.entity';
import { ContestQuizEntity } from './contest-quiz.entity';
import { QuestionEntity } from './question.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'quiz' })
export class QuizEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ default: '' })
  image: string;

  @Column({ type: 'int', default: EQuizStatus.Draft })
  status: EQuizStatus;

  @Column({ default: EQuizVisibility.Public })
  visibility: EQuizVisibility;

  @Column({ default: 1 })
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (entity) => entity.quizzes, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToMany(() => CategoryEntity, { cascade: true })
  @JoinTable({ name: 'quiz_category' })
  categories: CategoryEntity[];

  @OneToMany(() => QuestionEntity, (entity) => entity.quiz, { cascade: true })
  questions: QuestionEntity[];

  @OneToMany(() => ContestQuizEntity, (entity) => entity.quiz)
  contestQuizzes: ContestQuizEntity[];
}
