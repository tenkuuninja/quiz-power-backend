import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContestQuestionOptionEntity } from './contest-question-option.entity';
import { ContestQuizEntity } from './contest-quiz.entity';
import { AnswerEntity } from './answer.entity';
import { EQuestionType } from '../common/enums/entity.enum';

@Entity({ name: 'contest_question' })
export class ContestQuestionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Column()
  // contestQuizId: number;

  @Column({ type: 'text' })
  content: string;

  @Column()
  questionType: EQuestionType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ContestQuizEntity, (entity) => entity.questions, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  contestQuiz: ContestQuizEntity;

  @OneToMany(
    () => ContestQuestionOptionEntity,
    (answer) => answer.contestQuestion,
  )
  options: ContestQuestionOptionEntity[];

  @OneToMany(() => AnswerEntity, (entity) => entity.contestQuestion)
  answers: AnswerEntity;
}
