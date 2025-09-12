export interface KeywordMetricsDto {
    searchVolume: number | null;
    competition: 'HIGH' | 'MEDIUM' | 'LOW' | null;
    competitionIndex: number | null;
    freshness: 'fresh' | 'stale' | 'processing';
    source: 'naver-ads-api' | 'cache' | 'fallback';
}
export interface TrendDataDto {
    date: string;
    value: number;
}
export interface KeywordTrendsDto {
    data: TrendDataDto[];
    freshness: 'fresh' | 'stale' | 'processing';
    source: 'naver-datalab' | 'cache' | 'fallback';
}
export interface RelatedTermDto {
    term: string;
    relevance: number;
    searchVolume?: number;
}
export interface RelatedTermsDto {
    terms: RelatedTermDto[];
    freshness: 'fresh' | 'stale' | 'processing';
    source: 'naver-autocomplete' | 'naver-related' | 'cache' | 'fallback';
}
export interface TagSuggestionDto {
    tag: string;
    frequency: number;
    category?: string;
}
export interface TagSuggestionsDto {
    tags: TagSuggestionDto[];
    freshness: 'fresh' | 'stale' | 'processing';
    source: 'blog-crawling' | 'cache' | 'fallback';
}
export interface KeywordAnalysisResponseDto {
    keyword: string;
    timestamp: string;
    metrics: KeywordMetricsDto;
    trends: KeywordTrendsDto;
    relatedTerms: RelatedTermsDto;
    tagSuggestions: TagSuggestionsDto;
}
