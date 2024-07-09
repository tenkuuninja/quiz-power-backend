import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ContestQuestionEntity } from './contest-question.entity';

@Entity({ name: 'contest_question_option' })
export class ContestQuestionOptionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Column()
  // contestQuestionId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean' })
  isCorrect: boolean;

  @ManyToOne(() => ContestQuestionEntity, (entity) => entity.options, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  contestQuestion: ContestQuestionEntity;
}
