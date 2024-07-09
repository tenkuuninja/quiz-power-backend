import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContestEntity, QuizEntity, UserEntity } from '../../entities';
import { ContestController } from './contest.controller';
import { ContestService } from './contest.service';
import { ContestSocketGateway } from './contest.socket-gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContestEntity, QuizEntity, UserEntity]),
    JwtModule,
  ],
  controllers: [ContestController],
  providers: [ContestService, ContestSocketGateway],
})
export class ContestModule {}
