import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity, UserEntity } from '../../entities';
import { AppUserController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, OtpEntity]),
    JwtModule,
    MailModule,
  ],
  controllers: [AppUserController],
  providers: [AuthService],
})
export class AuthModule {}
