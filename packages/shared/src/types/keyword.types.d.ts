export interface KeywordMetrics {
    searchVolume: number | null;
    competition: 'HIGH' | 'MEDIUM' | 'LOW' | null;
    competitionIndex: number | null;
    freshness: 'fresh' | 'stale' | 'processing';
    source: 'naver-ads-api' | 'cache' | 'fallback';
}
export interface KeywordTrends {
    data: Array<{
        date: string;
        value: number;
    }>;
    freshness: 'fresh' | 'stale' | 'processing';
    source: 'naver-datalab' | 'cache' | 'fallback';
}
export interface RelatedTerms {
    terms: Array<{
        term: string;
        relevance: number;
        searchVolume?: number;
    }>;
    freshness: 'fresh' | 'stale' | 'processing';
    source: 'naver-autocomplete' | 'naver-related' | 'cache' | 'fallback';
}
export interface TagSuggestions {
    tags: Array<{
        tag: string;
        frequency: number;
        category?: string;
    }>;
    freshness: 'fresh' | 'stale' | 'processing';
    source: 'blog-crawling' | 'cache' | 'fallback';
}
export interface KeywordAnalysisResponse {
    keyword: string;
    timestamp: string;
    metrics: KeywordMetrics;
    trends: KeywordTrends;
    relatedTerms: RelatedTerms;
    tagSuggestions: TagSuggestions;
}
export interface KeywordResearchRequest {
    keyword: string;
    options?: {
        includeMetrics?: boolean;
        includeTrends?: boolean;
        includeRelated?: boolean;
        includeTags?: boolean;
        forceRefresh?: boolean;
    };
}
