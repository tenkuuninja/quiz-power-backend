import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { APP_GUARD, APP_PIPE } from '@nestjs/core';

import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DATABASE_URL } from './configs/app';
import * as Entities from './entities';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ContestModule } from './modules/contest/contest.module';
import { MailModule } from './modules/mail/mail.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({ ttl: 60, limit: 60 }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: DATABASE_URL,
      entities: [...Object.values(Entities)],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
      serveRoot: '/public',
    }),
    MailModule,
    AuthModule,
    CategoryModule,
    QuizModule,
    ContestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
