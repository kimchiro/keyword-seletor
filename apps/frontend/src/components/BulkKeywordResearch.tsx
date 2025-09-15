'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import { BulkKeywordForm } from './BulkKeywordForm';
import { BulkKeywordResults } from './BulkKeywordResults';
import { ErrorMessage } from './ErrorMessage';
import { keywordApi } from '@/lib/api';
import { BulkKeywordResearchResponse } from '@/types/keyword';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const ProgressContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #667eea;
`;

const ProgressTitle = styled.h4`
  color: #2d3748;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 0.9rem;
  color: #718096;
  display: flex;
  justify-content: space-between;
`;

const StatusMessage = styled.div<{ type: 'info' | 'success' | 'warning' }>`
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.9rem;
  
  ${({ type }) => {
    switch (type) {
      case 'info':
        return 'background: #ebf8ff; color: #2b6cb0; border-left: 4px solid #3182ce;';
      case 'success':
        return 'background: #f0fff4; color: #22543d; border-left: 4px solid #38a169;';
      case 'warning':
        return 'background: #fffbeb; color: #9c4221; border-left: 4px solid #ed8936;';
    }
  }}
`;

const TipsContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 12px;
`;

const TipsTitle = styled.h4`
  color: #2d3748;
  margin-bottom: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TipsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TipItem = styled.li`
  padding: 0.5rem 0;
  color: #4a5568;
  font-size: 0.9rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  &:before {
    content: '💡';
    flex-shrink: 0;
  }
`;

interface BulkKeywordResearchProps {
  onNavigateToSettings?: () => void;
  refreshTrigger?: number;
}

export function BulkKeywordResearch({ onNavigateToSettings, refreshTrigger }: BulkKeywordResearchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BulkKeywordResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentKeyword, setCurrentKeyword] = useState<string>('');
  const [searchedCount, setSearchedCount] = useState(0);
  const [targetCount, setTargetCount] = useState(0);


  const handleSubmit = async (data: { initialKeyword: string; searchCount: number }) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setProgress(0);
    setCurrentKeyword(data.initialKeyword);
    setSearchedCount(0);
    setTargetCount(data.searchCount);

    try {
      // 진행률 시뮬레이션을 위한 인터벌
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 1000);

      const response = await keywordApi.bulkResearchKeywords(data);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResults(response);
      setSearchedCount(response.totalSearched);
      
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || '키워드 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusMessage = () => {
    if (isLoading) {
      return (
        <StatusMessage type="info">
          🔄 현재 &quot;{currentKeyword}&quot;와 연관된 키워드들을 조회하고 있습니다. 
          각 키워드마다 검색량, 경쟁률, 문서수를 분석 중입니다.
        </StatusMessage>
      );
    }
    
    if (results) {
      return (
        <StatusMessage type="success">
          ✅ 키워드 조회가 완료되었습니다! 총 {results.totalSearched}개의 키워드를 분석했으며, 
          {results.skippedDuplicates}개의 중복 키워드를 건너뛰었습니다.
        </StatusMessage>
      );
    }
    
    return null;
  };

  return (
    <Container>
      <BulkKeywordForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        onNavigateToSettings={onNavigateToSettings}
        refreshTrigger={refreshTrigger}
      />
      
      {error && <ErrorMessage message={error} />}
      
      {getStatusMessage()}
      
      {isLoading && (
        <ProgressContainer>
          <ProgressTitle>키워드 조회 진행 상황</ProgressTitle>
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>
          <ProgressText>
            <span>진행률: {Math.round(progress)}%</span>
            <span>{searchedCount} / {targetCount}개 조회 중</span>
          </ProgressText>
        </ProgressContainer>
      )}
      
      <BulkKeywordResults results={results} isLoading={isLoading} />
      
      {!isLoading && !results && (
        <TipsContainer>
          <TipsTitle>
            💡 사용 팁
          </TipsTitle>
          <TipsList>
            <TipItem>
              구체적인 키워드일수록 더 정확한 연관 키워드를 찾을 수 있습니다.
            </TipItem>
            <TipItem>
              조회 개수가 많을수록 시간이 오래 걸리지만, 더 다양한 키워드를 발견할 수 있습니다.
            </TipItem>
            <TipItem>
              결과 테이블에서 정렬과 검색 기능을 활용해 원하는 키워드를 쉽게 찾아보세요.
            </TipItem>
            <TipItem>
              CSV 다운로드 기능으로 결과를 엑셀에서 추가 분석할 수 있습니다.
            </TipItem>
            <TipItem>
              경쟁률이 낮고 검색량이 적당한 키워드가 블로그 포스팅에 유리합니다.
            </TipItem>
          </TipsList>
        </TipsContainer>
      )}
    </Container>
  );
}
