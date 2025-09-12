/**
 * Redis 캐시 키 생성 유틸리티
 */

export const CacheKeys = {
  // 키워드 검색량 (월별)
  keywordVolume: (keyword: string, yearMonth: string) => 
    `kw:vol:${keyword}:${yearMonth}`,

  // 키워드 트렌드 (전체)
  keywordTrends: (keyword: string) => 
    `kw:trend:${keyword}:all`,

  // 연관 검색어
  relatedTerms: (keyword: string) => 
    `kw:rel:${keyword}`,

  // 태그 후보
  tagSuggestions: (keyword: string) => 
    `kw:tags:${keyword}`,

  // 리포트 스냅샷
  reportSnapshot: (keyword: string) => 
    `kw:report:${keyword}:latest`,

  // 레이트 리미터
  rateLimit: (identifier: string) => 
    `ratelimit:${identifier}`,

  // 서킷 브레이커
  circuitBreaker: (vendor: string) => 
    `circuit:vendor:${vendor}`,
} as const;
