import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionEntity } from './question.entity';

@Entity({ name: 'question_option' })
export class QuestionOptionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Column()
  // questionId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'bool', default: 0 })
  isCorrect: boolean;

  @ManyToOne(() => QuestionEntity, (entity) => entity.options, {
    // cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  question: QuestionEntity;
}
