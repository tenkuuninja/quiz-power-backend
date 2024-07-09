import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ContestEntity } from './contest.entity';

@Entity({ name: 'contest_code' })
export class ContestCodeEntity {
  @PrimaryColumn()
  contestId: number;

  @Column()
  code: string;

  @OneToOne(() => ContestEntity, { cascade: true })
  @JoinColumn({})
  contest: ContestEntity;
}
