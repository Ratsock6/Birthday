// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RsvpModule } from './rsvp/rsvp.module';
import { FoodRestrictionsModule } from './food-restrictions/food-restrictions.module';
import { WallModule } from './wall/wall.module';
import { WebsocketModule } from './websocket/websocket.module';
import { KillerModule } from './killer/killer.module';
import { MediaModule } from './media/media.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { AnecdotesModule } from './anecdotes/anecdotes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RsvpModule,
    FoodRestrictionsModule,
    WallModule,
    WebsocketModule,
    KillerModule,
    MediaModule,
    QuestionnaireModule,
    AnecdotesModule,
  ],
})
export class AppModule {}