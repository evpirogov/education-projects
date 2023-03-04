import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import * as LocalSession from 'telegraf-session-local';
import { TelegrafModule } from 'nestjs-telegraf';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TaskEntity } from './task.entity';

const sessions = new LocalSession({database: 'session_db.json'})

@Module({
  imports: [
      TelegrafModule.forRoot({
          middlewares: [sessions.middleware()],
          token: '5942125709:AAG7SH3OXAmlndiagpd6RQ7jxcwekewbAr4'
      }),
      TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          database: 'todo-app-tg-bot',
          username: 'postgres',
          password: 'gbhj;jr',
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          migrations: [join(__dirname, '**', '*.migrations.{ts,js}')],
          synchronize: true
      }),
      TypeOrmModule.forFeature([TaskEntity])
  ],
  providers: [AppService, AppUpdate]
})
export class AppModule {}