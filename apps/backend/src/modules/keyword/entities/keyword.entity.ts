export interface KeywordEntity {
  id: number;
  keyword: string;
  firstSearchedAt: Date;
  lastSearchedAt: Date;
  searchCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
