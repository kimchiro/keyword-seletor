import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
// import * as redisStore from 'cache-manager-redis-store';

import { DatabaseConfig } from './config/database.config';
import { RedisConfig } from './config/redis.config';
import { KeywordModule } from './modules/keyword/keyword.module';
import { ReportModule } from './modules/report/report.module';
import { CrawlerModule } from './modules/crawler/crawler.module';

@Module({
  imports: [
    // 환경 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env.local', '../../.env'],
    }),

    // 데이터베이스 설정
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),

    // Redis 캐시 설정
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: RedisConfig,
    }),

    // 레이트 리미터 설정
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1초
        limit: 10, // 1초당 10회
      },
      {
        name: 'medium',
        ttl: 60000, // 1분
        limit: 100, // 1분당 100회
      },
      {
        name: 'long',
        ttl: 3600000, // 1시간
        limit: 1000, // 1시간당 1000회
      },
    ]),

    // BullMQ 큐 설정
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD,
          db: parseInt(process.env.REDIS_QUEUE_DB) || 1,
        },
      }),
    }),

    // 비즈니스 모듈들
    KeywordModule,
    ReportModule,
    CrawlerModule,
  ],
})
export class AppModule {}
