import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';

@Injectable()
export class RedisConfig implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    return {
      ttl: parseInt(this.configService.get('CACHE_TTL', '3600')), // 기본 1시간
      max: parseInt(this.configService.get('CACHE_MAX_ITEMS', '1000')),
    };
  }
}
