import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ContestQuestionEntity } from './contest-question.entity';
import { PlayerEntity } from './player.entity';

@Entity({ name: 'answer' })
export class AnswerEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Column()
  // playerId: number;

  // @Column()
  // contestQuestionId: number;

  @Column({ type: 'json', nullable: true })
  optionIds: string[];

  @Column({ nullable: true })
  content: string | null;

  @Column()
  isCorrect: boolean;

  @Column()
  score: number;

  @Column()
  startedAt: Date;

  @Column()
  endedAt: Date;

  @ManyToOne(() => PlayerEntity, (entity) => entity.answers, { cascade: true })
  player: PlayerEntity;

  @ManyToOne(() => ContestQuestionEntity, (entity) => entity.answers, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  contestQuestion: ContestQuestionEntity;
}
