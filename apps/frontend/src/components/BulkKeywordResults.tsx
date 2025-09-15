'use client';

import styled from '@emotion/styled';
import { useState, useMemo } from 'react';
import { KeywordMetrics } from '@/types/keyword';

interface BulkKeywordResultsProps {
  results: {
    keywords: KeywordMetrics[];
    totalSearched: number;
    skippedDuplicates: number;
    completedAt: string;
  } | null;
  isLoading: boolean;
}

const Container = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Summary = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 0.9rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Controls = styled.div`
  padding: 1rem 2rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SortSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ExportButton = styled.button`
  padding: 0.5rem 1rem;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #38a169;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  max-height: 600px;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2d3748;
  border-bottom: 2px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 1;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
`;

const KeywordCell = styled(Td)`
  font-weight: 600;
  color: #2d3748;
  max-width: 200px;
  word-break: break-word;
`;

const NumberCell = styled(Td)`
  text-align: right;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
`;

const CompetitionBadge = styled.span<{ level: 'LOW' | 'MEDIUM' | 'HIGH' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  
  ${({ level }) => {
    switch (level) {
      case 'LOW':
        return 'background: #c6f6d5; color: #22543d;';
      case 'MEDIUM':
        return 'background: #fed7aa; color: #9c4221;';
      case 'HIGH':
        return 'background: #fed7d7; color: #742a2a;';
    }
  }}
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #718096;
`;

const LoadingState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #718096;
`;

type SortField = 'keyword' | 'totalMonthlySearchVolume' | 'documentCount' | 'competitionRate';
type SortDirection = 'asc' | 'desc';

export function BulkKeywordResults({ results, isLoading }: BulkKeywordResultsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('totalMonthlySearchVolume');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredAndSortedKeywords = useMemo(() => {
    if (!results?.keywords) return [];

    const filtered = results.keywords.filter(keyword =>
      keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [results?.keywords, searchTerm, sortField, sortDirection]);

  const handleExportCSV = () => {
    if (!results?.keywords) return;

    const headers = [
      '키워드',
      'PC 월간검색수',
      '모바일 월간검색수',
      '총 월간검색수',
      '문서수',
      '경쟁률',
      '경쟁도'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredAndSortedKeywords.map(keyword => [
        `"${keyword.keyword}"`,
        keyword.pcMonthlySearchVolume,
        keyword.mobileMonthlySearchVolume,
        keyword.totalMonthlySearchVolume,
        keyword.documentCount,
        keyword.competitionRate,
        keyword.competitionLevel
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `키워드_분석_결과_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingState>
          <div>🔄 키워드를 조회하고 있습니다...</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            연관 키워드를 찾아 반복 조회 중입니다. 잠시만 기다려주세요.
          </div>
        </LoadingState>
      </Container>
    );
  }

  if (!results) {
    return (
      <Container>
        <EmptyState>
          <div>📊 키워드 조회 결과가 여기에 표시됩니다</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            위에서 초기 키워드와 조회할 개수를 입력하고 조회를 시작해보세요.
          </div>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>📊 키워드 조회 결과</Title>
        <Summary>
          <span>총 {results.totalSearched}개 키워드 조회</span>
          <span>중복 {results.skippedDuplicates}개 건너뛰기</span>
          <span>완료시간: {new Date(results.completedAt).toLocaleString('ko-KR')}</span>
        </Summary>
      </Header>

      <Controls>
        <SearchInput
          type="text"
          placeholder="키워드 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <SortSelect
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortField(field as SortField);
              setSortDirection(direction as SortDirection);
            }}
          >
            <option value="totalMonthlySearchVolume-desc">총 검색량 높은순</option>
            <option value="totalMonthlySearchVolume-asc">총 검색량 낮은순</option>
            <option value="documentCount-desc">문서수 많은순</option>
            <option value="documentCount-asc">문서수 적은순</option>
            <option value="competitionRate-desc">경쟁률 높은순</option>
            <option value="competitionRate-asc">경쟁률 낮은순</option>
            <option value="keyword-asc">키워드 가나다순</option>
          </SortSelect>
          
          <ExportButton onClick={handleExportCSV}>
            📥 CSV 다운로드
          </ExportButton>
        </div>
      </Controls>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>키워드</Th>
              <Th>PC 월간검색수</Th>
              <Th>모바일 월간검색수</Th>
              <Th>총 월간검색수</Th>
              <Th>문서수</Th>
              <Th>경쟁률</Th>
              <Th>경쟁도</Th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedKeywords.map((keyword, index) => (
              <tr key={index}>
                <KeywordCell>{keyword.keyword}</KeywordCell>
                <NumberCell>{formatNumber(keyword.pcMonthlySearchVolume)}</NumberCell>
                <NumberCell>{formatNumber(keyword.mobileMonthlySearchVolume)}</NumberCell>
                <NumberCell>{formatNumber(keyword.totalMonthlySearchVolume)}</NumberCell>
                <NumberCell>{formatNumber(keyword.documentCount)}</NumberCell>
                <NumberCell>{keyword.competitionRate.toFixed(2)}</NumberCell>
                <Td>
                  <CompetitionBadge level={keyword.competitionLevel}>
                    {keyword.competitionLevel}
                  </CompetitionBadge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {filteredAndSortedKeywords.length === 0 && searchTerm && (
        <EmptyState>
          <div>🔍 &quot;{searchTerm}&quot;에 대한 검색 결과가 없습니다</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            다른 키워드로 검색해보세요.
          </div>
        </EmptyState>
      )}
    </Container>
  );
}
