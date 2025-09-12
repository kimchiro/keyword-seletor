export interface KeywordResearchDto {
    keyword: string;
    includeMetrics?: boolean;
    includeTrends?: boolean;
    includeRelated?: boolean;
    includeTags?: boolean;
    forceRefresh?: boolean;
}
