export interface RelatedTermsEntity {
  id: number;
  rootKeyword: string;
  relatedTerm: string;
  relevance: number;
  searchVolume: number | null;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}
