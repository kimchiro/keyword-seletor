'use client';

import { useQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { keywordApi } from '@/lib/api';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { MetricsCard } from './MetricsCard';
import { TrendsChart } from './TrendsChart';
import { RelatedTermsList } from './RelatedTermsList';
import { TagSuggestionsList } from './TagSuggestionsList';

const ResultsContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const KeywordTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const Timestamp = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

interface KeywordResultsProps {
  keyword: string;
}

export function KeywordResults({ keyword }: KeywordResultsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['keyword-research', keyword],
    queryFn: () => keywordApi.researchKeyword({ keyword }),
    enabled: !!keyword,
  });

  if (isLoading) {
    return (
      <ResultsContainer>
        <LoadingSpinner message="키워드 분석 중..." />
      </ResultsContainer>
    );
  }

  if (error) {
    return (
      <ResultsContainer>
        <ErrorMessage 
          title="분석 오류"
          message="키워드 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        />
      </ResultsContainer>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <ResultsContainer>
      <Header>
        <KeywordTitle>&quot;{data.keyword}&quot; 분석 결과</KeywordTitle>
        <Timestamp>
          분석 시각: {new Date(data.timestamp).toLocaleString('ko-KR')}
        </Timestamp>
      </Header>

      <Grid>
        <MetricsCard metrics={data.metrics} />
        <TrendsChart trends={data.trends} />
        <RelatedTermsList relatedTerms={data.relatedTerms} />
        <TagSuggestionsList tagSuggestions={data.tagSuggestions} />
      </Grid>
    </ResultsContainer>
  );
}
