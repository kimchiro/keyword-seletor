import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

import { KeywordEntity } from './entities/keyword.entity';
import { KeywordResearchDto } from './dto/keyword-research.dto';
import { KeywordAnalysisResponseDto } from './dto/keyword-analysis-response.dto';

@Injectable()
export class KeywordService {
  constructor(
    @InjectRepository(KeywordEntity)
    private keywordRepository: Repository<KeywordEntity>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectQueue('keyword-metrics')
    private metricsQueue: Queue,
    @InjectQueue('keyword-trends')
    private trendsQueue: Queue,
    @InjectQueue('related-terms')
    private relatedQueue: Queue,
    @InjectQueue('tag-suggestions')
    private tagsQueue: Queue,
  ) {}

  async researchKeyword(
    dto: KeywordResearchDto,
  ): Promise<KeywordAnalysisResponseDto> {
    const { keyword } = dto;
    
    // 캐시 키 생성
    const cacheKey = `kw:report:${keyword}:latest`;
    
    // 캐시된 결과 확인
    const cachedResult = await this.cacheManager.get<KeywordAnalysisResponseDto>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // 키워드 엔티티 생성 또는 조회
    let keywordEntity = await this.keywordRepository.findOne({
      where: { keyword },
    });

    if (!keywordEntity) {
      keywordEntity = this.keywordRepository.create({
        keyword,
        firstSearchedAt: new Date(),
        lastSearchedAt: new Date(),
        searchCount: 1,
      });
    } else {
      keywordEntity.lastSearchedAt = new Date();
      keywordEntity.searchCount += 1;
    }

    await this.keywordRepository.save(keywordEntity);

    // 비동기 작업 큐에 추가
    await Promise.all([
      this.metricsQueue.add('fetch-metrics', { keyword }),
      this.trendsQueue.add('fetch-trends', { keyword }),
      this.relatedQueue.add('fetch-related', { keyword }),
      this.tagsQueue.add('fetch-tags', { keyword }),
    ]);

    // 기본 응답 생성 (실제로는 큐 처리 후 업데이트됨)
    const response: KeywordAnalysisResponseDto = {
      keyword,
      timestamp: new Date().toISOString(),
      metrics: {
        searchVolume: null,
        competition: null,
        competitionIndex: null,
        freshness: 'processing',
        source: 'naver-ads-api',
      },
      trends: {
        data: [],
        freshness: 'processing',
        source: 'naver-datalab',
      },
      relatedTerms: {
        terms: [],
        freshness: 'processing',
        source: 'naver-autocomplete',
      },
      tagSuggestions: {
        tags: [],
        freshness: 'processing',
        source: 'blog-crawling',
      },
    };

    // 24시간 캐시
    await this.cacheManager.set(cacheKey, response, 24 * 60 * 60 * 1000);

    return response;
  }

  async getKeywordMetrics(keyword: string) {
    const cacheKey = `kw:vol:${keyword}:${new Date().toISOString().slice(0, 7)}`;
    return this.cacheManager.get(cacheKey);
  }

  async getKeywordTrends(keyword: string) {
    const cacheKey = `kw:trend:${keyword}:all`;
    return this.cacheManager.get(cacheKey);
  }

  async getRelatedTerms(keyword: string) {
    const cacheKey = `kw:rel:${keyword}`;
    return this.cacheManager.get(cacheKey);
  }

  async getTagSuggestions(keyword: string) {
    const cacheKey = `kw:tags:${keyword}`;
    return this.cacheManager.get(cacheKey);
  }
}
