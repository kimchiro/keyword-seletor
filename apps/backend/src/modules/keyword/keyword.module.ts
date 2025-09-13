import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { KeywordController } from './keyword.controller';
import { KeywordService } from './keyword.service';
import { SettingsModule } from '../settings/settings.module';
import { KeywordEntity } from './entities/keyword.entity';
import { KeywordMetricsEntity } from './entities/keyword-metrics.entity';
import { KeywordTrendsEntity } from './entities/keyword-trends.entity';
import { RelatedTermsEntity } from './entities/related-terms.entity';
import { TagSuggestionsEntity } from './entities/tag-suggestions.entity';

// 큐 프로세서들
import { KeywordMetricsProcessor } from '../../queue/processors/keyword-metrics.processor';
import { KeywordTrendsProcessor } from '../../queue/processors/keyword-trends.processor';
import { RelatedTermsProcessor } from '../../queue/processors/related-terms.processor';
import { TagSuggestionsProcessor } from '../../queue/processors/tag-suggestions.processor';

@Module({
  imports: [
    SettingsModule,
    TypeOrmModule.forFeature([
      KeywordEntity,
      KeywordMetricsEntity,
      KeywordTrendsEntity,
      RelatedTermsEntity,
      TagSuggestionsEntity,
    ]),
    BullModule.registerQueue(
      { name: 'keyword-metrics' },
      { name: 'keyword-trends' },
      { name: 'related-terms' },
      { name: 'tag-suggestions' },
    ),
  ],
  controllers: [KeywordController],
  providers: [
    KeywordService,
    KeywordMetricsProcessor,
    KeywordTrendsProcessor,
    RelatedTermsProcessor,
    TagSuggestionsProcessor,
  ],
  exports: [KeywordService],
})
export class KeywordModule {}
