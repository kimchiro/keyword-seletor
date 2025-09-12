import { ApiProperty } from '@nestjs/swagger';
import { KeywordAnalysisResponseDto as IKeywordAnalysisResponseDto } from '@keyword-selector/shared';

export class KeywordMetricsDto {
  @ApiProperty({ description: '월 검색량', nullable: true })
  searchVolume!: number | null;

  @ApiProperty({ description: '경쟁도', enum: ['HIGH', 'MEDIUM', 'LOW'], nullable: true })
  competition!: 'HIGH' | 'MEDIUM' | 'LOW' | null;

  @ApiProperty({ description: '경쟁도 지수', nullable: true })
  competitionIndex!: number | null;

  @ApiProperty({ description: '데이터 신선도', enum: ['fresh', 'stale', 'processing'] })
  freshness!: 'fresh' | 'stale' | 'processing';

  @ApiProperty({ description: '데이터 출처', enum: ['naver-ads-api', 'cache', 'fallback'] })
  source!: 'naver-ads-api' | 'cache' | 'fallback';
}

export class TrendDataDto {
  @ApiProperty({ description: '날짜' })
  date!: string;

  @ApiProperty({ description: '트렌드 값' })
  value!: number;
}

export class KeywordTrendsDto {
  @ApiProperty({ description: '트렌드 데이터', type: [TrendDataDto] })
  data!: TrendDataDto[];

  @ApiProperty({ description: '데이터 신선도', enum: ['fresh', 'stale', 'processing'] })
  freshness!: 'fresh' | 'stale' | 'processing';

  @ApiProperty({ description: '데이터 출처', enum: ['naver-datalab', 'cache', 'fallback'] })
  source!: 'naver-datalab' | 'cache' | 'fallback';
}

export class RelatedTermDto {
  @ApiProperty({ description: '연관 검색어' })
  term!: string;

  @ApiProperty({ description: '관련도' })
  relevance!: number;

  @ApiProperty({ description: '검색량', required: false })
  searchVolume?: number;
}

export class RelatedTermsDto {
  @ApiProperty({ description: '연관 검색어 목록', type: [RelatedTermDto] })
  terms!: RelatedTermDto[];

  @ApiProperty({ description: '데이터 신선도', enum: ['fresh', 'stale', 'processing'] })
  freshness!: 'fresh' | 'stale' | 'processing';

  @ApiProperty({ description: '데이터 출처', enum: ['naver-autocomplete', 'naver-related', 'cache', 'fallback'] })
  source!: 'naver-autocomplete' | 'naver-related' | 'cache' | 'fallback';
}

export class TagSuggestionDto {
  @ApiProperty({ description: '태그' })
  tag!: string;

  @ApiProperty({ description: '빈도수' })
  frequency!: number;

  @ApiProperty({ description: '카테고리', required: false })
  category?: string;
}

export class TagSuggestionsDto {
  @ApiProperty({ description: '태그 후보 목록', type: [TagSuggestionDto] })
  tags!: TagSuggestionDto[];

  @ApiProperty({ description: '데이터 신선도', enum: ['fresh', 'stale', 'processing'] })
  freshness!: 'fresh' | 'stale' | 'processing';

  @ApiProperty({ description: '데이터 출처', enum: ['blog-crawling', 'cache', 'fallback'] })
  source!: 'blog-crawling' | 'cache' | 'fallback';
}

export class KeywordAnalysisResponseDto implements IKeywordAnalysisResponseDto {
  @ApiProperty({ description: '분석 키워드' })
  keyword!: string;

  @ApiProperty({ description: '분석 시각' })
  timestamp!: string;

  @ApiProperty({ description: '검색량 및 경쟁도 정보', type: KeywordMetricsDto })
  metrics!: KeywordMetricsDto;

  @ApiProperty({ description: '트렌드 정보', type: KeywordTrendsDto })
  trends!: KeywordTrendsDto;

  @ApiProperty({ description: '연관 검색어 정보', type: RelatedTermsDto })
  relatedTerms!: RelatedTermsDto;

  @ApiProperty({ description: '태그 후보 정보', type: TagSuggestionsDto })
  tagSuggestions!: TagSuggestionsDto;
}
