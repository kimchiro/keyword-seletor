import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import type { Job } from 'bull';
import axios from 'axios';

import { RelatedTermsEntity } from '../../modules/keyword/entities/related-terms.entity';
import { MemoryStorageService } from '../../common/storage/memory-storage.service';
import { COLLECTIONS } from '../../common/constants/collections';

@Injectable()
@Processor('related-terms')
export class RelatedTermsProcessor {
  private readonly logger = new Logger(RelatedTermsProcessor.name);

  constructor(
    private memoryStorage: MemoryStorageService,
  ) {}

  @Process('fetch-related')
  async handleFetchRelated(job: Job<{ keyword: string }>) {
    const { keyword } = job.data;
    this.logger.log(`연관 검색어 수집 시작: ${keyword}`);

    try {
      // 네이버 자동완성 및 연관검색어 API 호출
      const relatedTerms = await this.fetchNaverRelatedTerms(keyword);
      
      // 연관 검색어를 개별 레코드로 저장
      for (let i = 0; i < relatedTerms.terms.length; i++) {
        const term = relatedTerms.terms[i];
        const existingEntity = this.memoryStorage.findOne<RelatedTermsEntity>(
          COLLECTIONS.RELATED_TERMS,
          (item) => item.rootKeyword === keyword && item.relatedTerm === term
        );

        const relevance = (relatedTerms.terms.length - i) / relatedTerms.terms.length;

        if (existingEntity) {
          this.memoryStorage.update<RelatedTermsEntity>(
            COLLECTIONS.RELATED_TERMS,
            existingEntity.id,
            {
              relevance,
              source: relatedTerms.source,
            }
          );
        } else {
          this.memoryStorage.save<RelatedTermsEntity>(COLLECTIONS.RELATED_TERMS, {
            rootKeyword: keyword,
            relatedTerm: term,
            relevance,
            searchVolume: null,
            source: relatedTerms.source,
          });
        }
      }
      
      this.logger.log(`연관 검색어 수집 완료: ${keyword}, ${relatedTerms.terms.length}개`);
      return relatedTerms;
    } catch (error) {
      this.logger.error(`연관 검색어 수집 실패: ${keyword}`, error.stack);
      throw error;
    }
  }

  private async fetchNaverRelatedTerms(keyword: string) {
    const allTerms = new Set<string>();
    const sources = [];

    try {
      // 1. 네이버 자동완성 API
      const autocompleteTerms = await this.fetchAutocompleteTerms(keyword);
      autocompleteTerms.forEach(term => allTerms.add(term));
      if (autocompleteTerms.length > 0) sources.push('naver-autocomplete');

      // 2. 네이버 연관검색어 (검색 결과 페이지에서 추출)
      const relatedTerms = await this.fetchSearchRelatedTerms(keyword);
      relatedTerms.forEach(term => allTerms.add(term));
      if (relatedTerms.length > 0) sources.push('naver-related');

      // 3. 네이버 쇼핑 연관검색어
      const shoppingTerms = await this.fetchShoppingRelatedTerms(keyword);
      shoppingTerms.forEach(term => allTerms.add(term));
      if (shoppingTerms.length > 0) sources.push('naver-shopping');

      const finalTerms = Array.from(allTerms)
        .filter(term => term !== keyword && term.length > 1)
        .slice(0, 20); // 최대 20개

      return {
        terms: finalTerms,
        source: sources.join(', ') || 'naver-autocomplete',
      };
    } catch (error) {
      this.logger.error(`연관 검색어 수집 중 오류: ${keyword}`, error.message);
      return {
        terms: [],
        source: 'error',
      };
    }
  }

  private async fetchAutocompleteTerms(keyword: string): Promise<string[]> {
    try {
      const response = await axios.get('https://ac.search.naver.com/nx/ac', {
        params: {
          q: keyword,
          con: 1,
          frm: 'nv',
          ans: 2,
          r_format: 'json',
          r_enc: 'UTF-8',
          r_unicode: 0,
          t_koreng: 1,
          run: 2,
          rev: 4,
          q_enc: 'UTF-8',
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
          'Referer': 'https://www.naver.com/',
        },
        timeout: 5000,
      });

      if (response.data && response.data.items) {
        return response.data.items
          .map((item: string[]) => item[0])
          .filter((term: string) => term && term !== keyword)
          .slice(0, 10);
      }

      return [];
    } catch (error) {
      this.logger.warn(`자동완성 검색어 수집 실패: ${keyword}`, error.message);
      return [];
    }
  }

  private async fetchSearchRelatedTerms(keyword: string): Promise<string[]> {
    try {
      const response = await axios.get('https://search.naver.com/search.naver', {
        params: {
          query: keyword,
          where: 'nexearch',
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        },
        timeout: 8000,
      });

      const html = response.data;
      const relatedTerms: string[] = [];

      // 연관검색어 섹션에서 추출
      const relatedRegex = /<a[^>]*class="[^"]*related[^"]*"[^>]*>([^<]+)<\/a>/gi;
      let match;
      while ((match = relatedRegex.exec(html)) !== null) {
        const term = match[1].trim();
        if (term && term !== keyword && !relatedTerms.includes(term)) {
          relatedTerms.push(term);
        }
      }

      // 추가: 검색어 추천 섹션
      const suggestionRegex = /<span[^>]*class="[^"]*suggest[^"]*"[^>]*>([^<]+)<\/span>/gi;
      while ((match = suggestionRegex.exec(html)) !== null) {
        const term = match[1].trim();
        if (term && term !== keyword && !relatedTerms.includes(term)) {
          relatedTerms.push(term);
        }
      }

      return relatedTerms.slice(0, 8);
    } catch (error) {
      this.logger.warn(`검색 연관검색어 수집 실패: ${keyword}`, error.message);
      return [];
    }
  }

  private async fetchShoppingRelatedTerms(keyword: string): Promise<string[]> {
    try {
      const response = await axios.get('https://search.shopping.naver.com/search/all', {
        params: {
          query: keyword,
          cat_id: '',
          frm: 'NVSHATC',
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        },
        timeout: 8000,
      });

      const html = response.data;
      const shoppingTerms: string[] = [];

      // 쇼핑 연관검색어 추출
      const shoppingRegex = /<a[^>]*href="[^"]*query=([^"&]+)[^"]*"[^>]*>([^<]+)<\/a>/gi;
      let match;
      while ((match = shoppingRegex.exec(html)) !== null) {
        const term = decodeURIComponent(match[1]).trim();
        if (term && term !== keyword && !shoppingTerms.includes(term) && term.length > 1) {
          shoppingTerms.push(term);
        }
      }

      return shoppingTerms.slice(0, 5);
    } catch (error) {
      this.logger.warn(`쇼핑 연관검색어 수집 실패: ${keyword}`, error.message);
      return [];
    }
  }
}
