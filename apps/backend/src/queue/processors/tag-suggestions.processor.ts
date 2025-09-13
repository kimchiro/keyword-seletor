import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Job } from 'bull';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { TagSuggestionsEntity } from '../../modules/keyword/entities/tag-suggestions.entity';

@Injectable()
@Processor('tag-suggestions')
export class TagSuggestionsProcessor {
  private readonly logger = new Logger(TagSuggestionsProcessor.name);

  constructor(
    @InjectRepository(TagSuggestionsEntity)
    private tagSuggestionsRepository: Repository<TagSuggestionsEntity>,
  ) {}

  @Process('fetch-tags')
  async handleFetchTags(job: Job<{ keyword: string }>) {
    const { keyword } = job.data;
    this.logger.log(`태그 후보 수집 시작: ${keyword}`);

    try {
      // 네이버 블로그에서 실제 태그 수집
      const tagSuggestions = await this.fetchBlogTags(keyword);
      
      // 태그를 개별 레코드로 저장
      for (const tag of tagSuggestions.tags) {
        let tagEntity = await this.tagSuggestionsRepository.findOne({
          where: { rootKeyword: keyword, tag }
        });

        if (tagEntity) {
          tagEntity.frequency += 1;
          tagEntity.source = tagSuggestions.source;
        } else {
          tagEntity = this.tagSuggestionsRepository.create({
            rootKeyword: keyword,
            tag,
            frequency: 1,
            source: tagSuggestions.source,
          });
        }

        await this.tagSuggestionsRepository.save(tagEntity);
      }
      
      this.logger.log(`태그 후보 수집 완료: ${keyword}, ${tagSuggestions.tags.length}개`);
      return tagSuggestions;
    } catch (error) {
      this.logger.error(`태그 후보 수집 실패: ${keyword}`, error.stack);
      throw error;
    }
  }

  private async fetchBlogTags(keyword: string) {
    const allTags = new Set<string>();
    const sources = [];

    try {
      // 1. 네이버 블로그 검색 결과에서 태그 추출
      const blogTags = await this.fetchNaverBlogTags(keyword);
      blogTags.forEach(tag => allTags.add(tag));
      if (blogTags.length > 0) sources.push('naver-blog');

      // 2. 키워드 기반 태그 생성
      const generatedTags = this.generateRelatedTags(keyword);
      generatedTags.forEach(tag => allTags.add(tag));
      if (generatedTags.length > 0) sources.push('keyword-analysis');

      const finalTags = Array.from(allTags)
        .filter(tag => tag.length > 1 && tag.length < 20)
        .slice(0, 15); // 최대 15개

      return {
        tags: finalTags,
        source: sources.join(', ') || 'blog-crawling',
      };
    } catch (error) {
      this.logger.error(`태그 수집 중 오류: ${keyword}`, error.message);
      return {
        tags: this.generateRelatedTags(keyword),
        source: 'keyword-analysis',
      };
    }
  }

  private async fetchNaverBlogTags(keyword: string): Promise<string[]> {
    try {
      const response = await axios.get('https://search.naver.com/search.naver', {
        params: {
          where: 'post',
          query: keyword,
          sm: 'tab_jum',
          ie: 'utf8',
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      const tags: string[] = [];

      // 제목과 요약에서 키워드 추출
      $('.sh_blog_title, .api_txt_lines').each((_, element) => {
        const text = $(element).text().trim();
        const extractedTags = this.extractTagsFromText(text, keyword);
        extractedTags.forEach(tag => {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
      });

      return [...new Set(tags)].slice(0, 10);
    } catch (error) {
      this.logger.warn(`네이버 블로그 태그 수집 실패: ${keyword}`, error.message);
      return [];
    }
  }

  private extractTagsFromText(text: string, mainKeyword: string): string[] {
    const tags: string[] = [];
    
    // 한글 단어 추출 (2-10자)
    const koreanWords = text.match(/[가-힣]{2,10}/g) || [];
    
    koreanWords.forEach(word => {
      // 메인 키워드와 관련성이 있는 단어만 선택
      if (this.isRelatedToKeyword(word, mainKeyword)) {
        tags.push(word);
      }
    });

    return [...new Set(tags)].slice(0, 5);
  }

  private isRelatedToKeyword(word: string, keyword: string): boolean {
    // 메인 키워드와 관련성 체크
    if (word === keyword) return false; // 동일한 키워드 제외
    if (word.length < 2) return false; // 너무 짧은 단어 제외
    
    // 일반적인 불용어 제외
    const stopWords = ['그리고', '하지만', '그런데', '그래서', '이것', '저것', '여기', '거기', '이제', '지금', '오늘', '내일', '어제'];
    if (stopWords.includes(word)) return false;

    // 키워드와 공통 글자가 있는지 확인
    const keywordChars = new Set(keyword.split(''));
    const wordChars = new Set(word.split(''));
    const intersection = new Set([...keywordChars].filter(x => wordChars.has(x)));
    
    return intersection.size > 0 || word.includes(keyword) || keyword.includes(word);
  }

  private generateRelatedTags(keyword: string): string[] {
    const tags: string[] = [];
    
    // 키워드 분석 기반 태그 생성
    const keywordAnalysis = this.analyzeKeyword(keyword);
    
    // 카테고리별 관련 태그
    if (keywordAnalysis.category) {
      tags.push(...this.getCategoryTags(keywordAnalysis.category));
    }

    // 키워드 변형
    tags.push(...this.generateKeywordVariations(keyword));

    // 연관 개념
    tags.push(...this.getRelatedConcepts(keyword));

    return [...new Set(tags)].slice(0, 10);
  }

  private analyzeKeyword(keyword: string) {
    const categories = {
      '음식': ['맛집', '요리', '레시피', '음식', '먹거리', '카페', '디저트'],
      '여행': ['여행', '관광', '숙박', '호텔', '펜션', '맛집', '명소'],
      '패션': ['패션', '옷', '스타일', '코디', '브랜드', '쇼핑'],
      '뷰티': ['화장품', '스킨케어', '메이크업', '뷰티', '미용'],
      '건강': ['건강', '운동', '다이어트', '헬스', '요가', '피트니스'],
      '육아': ['육아', '아이', '아기', '유아', '교육', '장난감'],
      '인테리어': ['인테리어', '가구', '홈데코', '집꾸미기', '리모델링'],
      '취미': ['취미', '독서', '영화', '음악', '게임', '스포츠'],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(k => keyword.includes(k))) {
        return { category };
      }
    }

    return { category: null };
  }

  private getCategoryTags(category: string): string[] {
    const categoryTags = {
      '음식': ['맛집추천', '요리법', '레시피', '홈쿡', '외식', '디저트'],
      '여행': ['여행지추천', '국내여행', '해외여행', '여행팁', '관광명소'],
      '패션': ['데일리룩', '패션코디', '스타일링', '트렌드', '쇼핑'],
      '뷰티': ['뷰티팁', '화장법', '스킨케어', '제품리뷰', '미용'],
      '건강': ['건강관리', '운동법', '다이어트', '헬스케어', '웰빙'],
      '육아': ['육아팁', '아이용품', '교육', '놀이', '성장발달'],
      '인테리어': ['홈스타일링', '인테리어팁', '가구', '홈데코', '셀프인테리어'],
      '취미': ['취미생활', '여가활동', '문화생활', '자기계발', '힐링'],
    };

    return categoryTags[category] || [];
  }

  private generateKeywordVariations(keyword: string): string[] {
    const variations: string[] = [];
    
    // 접미사 추가
    const suffixes = ['추천', '후기', '리뷰', '정보', '방법', '팁', '가이드'];
    suffixes.forEach(suffix => {
      variations.push(`${keyword}${suffix}`);
    });

    // 접두사 추가
    const prefixes = ['베스트', '인기', '추천', '최고의'];
    prefixes.forEach(prefix => {
      variations.push(`${prefix}${keyword}`);
    });

    return variations.slice(0, 5);
  }

  private getRelatedConcepts(keyword: string): string[] {
    // 키워드와 관련된 개념들
    const conceptMap = {
      '탈모': ['모발관리', '헤어케어', '샴푸', '두피', '발모', '모발'],
      '다이어트': ['살빼기', '체중감량', '운동', '식단', '헬스', '피트니스'],
      '요리': ['레시피', '쿠킹', '홈쿡', '음식', '맛집', '먹거리'],
      '여행': ['관광', '휴가', '여행지', '숙박', '맛집', '명소'],
    };

    for (const [key, concepts] of Object.entries(conceptMap)) {
      if (keyword.includes(key)) {
        return concepts;
      }
    }

    return [];
  }
}
