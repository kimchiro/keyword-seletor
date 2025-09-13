import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { KeywordController } from './keyword.controller';
import { KeywordService } from './keyword.service';
import { SettingsModule } from '../settings/settings.module';
import { MemoryStorageService } from '../../common/storage/memory-storage.service';

// 큐 프로세서들
import { KeywordMetricsProcessor } from '../../queue/processors/keyword-metrics.processor';
import { KeywordTrendsProcessor } from '../../queue/processors/keyword-trends.processor';
import { RelatedTermsProcessor } from '../../queue/processors/related-terms.processor';
import { TagSuggestionsProcessor } from '../../queue/processors/tag-suggestions.processor';

@Module({
  imports: [
    SettingsModule,
    BullModule.registerQueue(
      { name: 'keyword-metrics' },
      { name: 'keyword-trends' },
      { name: 'related-terms' },
      { name: 'tag-suggestions' },
    ),
  ],
  controllers: [KeywordController],
  providers: [
    MemoryStorageService,
    KeywordService,
    KeywordMetricsProcessor,
    KeywordTrendsProcessor,
    RelatedTermsProcessor,
    TagSuggestionsProcessor,
  ],
  exports: [KeywordService, MemoryStorageService],
})
export class KeywordModule {}
