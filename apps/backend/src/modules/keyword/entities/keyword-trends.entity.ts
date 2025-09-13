export interface KeywordTrendsEntity {
  id: number;
  keyword: string;
  date: string; // YYYY-MM-DD 형식
  trendValue: number;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}
