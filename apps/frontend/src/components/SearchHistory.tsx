'use client';

import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { searchHistoryStorage, SearchHistoryItem } from '@/utils/localStorage';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
`;

const ClearButton = styled.button`
  padding: 0.5rem 1rem;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #c53030;
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4a5568;
`;

const EmptyDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  max-width: 400px;
  margin: 0 auto;
`;

const HistoryList = styled.div`
  display: grid;
  gap: 1rem;
`;

const HistoryCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const KeywordInfo = styled.div`
  flex: 1;
`;

const InitialKeyword = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
`;

const SearchDate = styled.div`
  font-size: 0.8rem;
  color: #718096;
`;

const DeleteButton = styled.button`
  padding: 0.25rem 0.5rem;
  background: transparent;
  color: #e53e3e;
  border: 1px solid #e53e3e;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e53e3e;
    color: white;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
`;

const PreviewContainer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const PreviewTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const KeywordPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const KeywordTag = styled.span`
  padding: 0.25rem 0.5rem;
  background: #667eea;
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

export function SearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setIsLoading(true);
    try {
      const historyData = searchHistoryStorage.getSearchHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('검색 기록 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    searchHistoryStorage.deleteSearchHistory(id);
    loadHistory();
  };

  const handleClearAll = () => {
    if (window.confirm('모든 검색 기록을 삭제하시겠습니까?')) {
      searchHistoryStorage.clearSearchHistory();
      loadHistory();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return '방금 전';
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const handleCardClick = (item: SearchHistoryItem) => {
    // 상세 보기 또는 재분석 기능을 추가할 수 있습니다
    console.log('검색 기록 상세 보기:', item);
  };

  if (isLoading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
          🔄 검색 기록을 불러오는 중...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>조회 기록</Title>
        {history.length > 0 && (
          <ClearButton onClick={handleClearAll}>
            🗑️ 전체 삭제
          </ClearButton>
        )}
      </Header>

      {history.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>아직 조회 기록이 없습니다</EmptyTitle>
          <EmptyDescription>
            무한반복 조회 탭에서 키워드를 조회하면<br />
            여기에 기록이 저장됩니다.
          </EmptyDescription>
        </EmptyState>
      ) : (
        <HistoryList>
          {history.map((item) => (
            <HistoryCard key={item.id} onClick={() => handleCardClick(item)}>
              <HistoryHeader>
                <KeywordInfo>
                  <InitialKeyword>"{item.initialKeyword}"</InitialKeyword>
                  <SearchDate>{formatDate(item.createdAt)}</SearchDate>
                </KeywordInfo>
                <DeleteButton onClick={(e) => handleDeleteItem(item.id, e)}>
                  삭제
                </DeleteButton>
              </HistoryHeader>

              <StatsContainer>
                <StatItem>
                  <StatValue>{item.results.totalSearched}</StatValue>
                  <StatLabel>조회된 키워드</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{item.results.skippedDuplicates}</StatValue>
                  <StatLabel>중복 건너뛰기</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{item.searchCount}</StatValue>
                  <StatLabel>목표 개수</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>
                    {item.results.keywords.reduce((sum, k) => sum + k.totalMonthlySearchVolume, 0).toLocaleString()}
                  </StatValue>
                  <StatLabel>총 검색량</StatLabel>
                </StatItem>
              </StatsContainer>

              <PreviewContainer>
                <PreviewTitle>조회된 키워드 미리보기 (상위 5개)</PreviewTitle>
                <KeywordPreview>
                  {item.results.keywords.slice(0, 5).map((keyword, index) => (
                    <KeywordTag key={index}>
                      {keyword.keyword}
                    </KeywordTag>
                  ))}
                  {item.results.keywords.length > 5 && (
                    <KeywordTag>+{item.results.keywords.length - 5}개 더</KeywordTag>
                  )}
                </KeywordPreview>
              </PreviewContainer>
            </HistoryCard>
          ))}
        </HistoryList>
      )}
    </Container>
  );
}
