// 메모리 스토리지 컬렉션 이름 상수
export const COLLECTIONS = {
  KEYWORDS: 'keywords',
  KEYWORD_METRICS: 'keyword_metrics',
  KEYWORD_TRENDS: 'keyword_trends',
  RELATED_TERMS: 'related_terms',
  TAG_SUGGESTIONS: 'tag_suggestions',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
