import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EQuestionType } from '../common/enums/entity.enum';
import { QuestionOptionEntity } from './question-option.entity';
import { QuizEntity } from './quiz.entity';

@Entity({ name: 'question' })
export class QuestionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Column()
  // quizId: number;

  @Column({ type: 'text' })
  content: string;

  @Column()
  questionType: EQuestionType;

  @Column({ nullable: true })
  answerLength?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => QuizEntity, (entity) => entity.questions, {
    // cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  quiz: QuizEntity;

  @OneToMany(() => QuestionOptionEntity, (entity) => entity.question, {
    cascade: true,
  })
  options: QuestionOptionEntity[];
}
