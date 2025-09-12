import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { KeywordController } from './keyword.controller';
import { KeywordService } from './keyword.service';
import { KeywordEntity } from './entities/keyword.entity';
import { KeywordMetricsEntity } from './entities/keyword-metrics.entity';
import { KeywordTrendsEntity } from './entities/keyword-trends.entity';
import { RelatedTermsEntity } from './entities/related-terms.entity';
import { TagSuggestionsEntity } from './entities/tag-suggestions.entity';

@Module({
  imports: [
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
  providers: [KeywordService],
  exports: [KeywordService],
})
export class KeywordModule {}
