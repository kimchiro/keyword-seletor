export declare const CacheKeys: {
    readonly keywordVolume: (keyword: string, yearMonth: string) => string;
    readonly keywordTrends: (keyword: string) => string;
    readonly relatedTerms: (keyword: string) => string;
    readonly tagSuggestions: (keyword: string) => string;
    readonly reportSnapshot: (keyword: string) => string;
    readonly rateLimit: (identifier: string) => string;
    readonly circuitBreaker: (vendor: string) => string;
};
