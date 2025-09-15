export interface KeywordMetrics {
  keyword: string;
  pcMonthlySearchVolume: number;
  mobileMonthlySearchVolume: number;
  totalMonthlySearchVolume: number;
  documentCount: number;
  competitionRate: number;
  competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface BulkKeywordResearchRequest {
  initialKeyword: string;
  searchCount: number;
}

export interface BulkKeywordResearchResponse {
  keywords: KeywordMetrics[];
  totalSearched: number;
  skippedDuplicates: number;
  completedAt: string;
}

export interface KeywordAnalysisResponse {
  keyword: string;
  timestamp: string;
  metrics: {
    searchVolume: number | null;
    competition: string | null;
    competitionIndex: number | null;
    freshness: 'fresh' | 'stale' | 'processing';
    source: string;
  };
  trends: {
    data: Array<{ date: string; value: number }>;
    freshness: 'fresh' | 'stale' | 'processing';
    source: string;
  };
  relatedTerms: {
    terms: Array<{ term: string; relevance: number; searchVolume?: number }>;
    freshness: 'fresh' | 'stale' | 'processing';
    source: string;
  };
  tagSuggestions: {
    tags: Array<{ tag: string; frequency: number; category: string }>;
    freshness: 'fresh' | 'stale' | 'processing';
    source: string;
  };
}
