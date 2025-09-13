export interface TagSuggestionsEntity {
  id: number;
  rootKeyword: string;
  tag: string;
  frequency: number;
  category: string | null;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}
