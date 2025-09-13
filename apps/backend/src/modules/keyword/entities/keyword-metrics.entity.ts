export interface KeywordMetricsEntity {
  id: number;
  keyword: string;
  yearMonth: string; // YYYY-MM 형식
  searchVolume: number | null;
  competition: 'HIGH' | 'MEDIUM' | 'LOW' | null;
  competitionIndex: number | null;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}
