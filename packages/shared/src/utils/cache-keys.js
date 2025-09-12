"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheKeys = void 0;
exports.CacheKeys = {
    keywordVolume: (keyword, yearMonth) => `kw:vol:${keyword}:${yearMonth}`,
    keywordTrends: (keyword) => `kw:trend:${keyword}:all`,
    relatedTerms: (keyword) => `kw:rel:${keyword}`,
    tagSuggestions: (keyword) => `kw:tags:${keyword}`,
    reportSnapshot: (keyword) => `kw:report:${keyword}:latest`,
    rateLimit: (identifier) => `ratelimit:${identifier}`,
    circuitBreaker: (vendor) => `circuit:vendor:${vendor}`,
};
//# sourceMappingURL=cache-keys.js.map