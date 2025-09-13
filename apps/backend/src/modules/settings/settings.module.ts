import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService], // 다른 모듈에서 사용할 수 있도록 export
})
export class SettingsModule {}
