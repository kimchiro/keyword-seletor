'use client';

import styled from '@emotion/styled';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import { FreshnessBadge } from './FreshnessBadge';

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
`;

const TermsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
`;

const TermItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const TermText = styled.span`
  font-weight: 500;
  color: #1f2937;
`;

const TermMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
`;

const CopyButton = styled.button`
  padding: 0.25rem 0.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #6b7280;
  font-size: 0.875rem;
`;

interface RelatedTermsListProps {
  relatedTerms: {
    terms: Array<{
      term: string;
      relevance: number;
      searchVolume?: number;
    }>;
    freshness: 'fresh' | 'stale' | 'processing';
    source: string;
  };
}

export function RelatedTermsList({ relatedTerms }: RelatedTermsListProps) {
  const hasData = relatedTerms.terms && relatedTerms.terms.length > 0;

  const handleCopy = (term: string) => {
    toast.success(`"${term}" 복사됨`);
  };

  const formatRelevance = (relevance: number) => {
    return `${Math.round(relevance * 100)}%`;
  };

  const formatSearchVolume = (volume?: number) => {
    if (!volume) return '';
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toLocaleString();
  };

  return (
    <Card>
      <Header>
        <Title>연관 검색어</Title>
        <FreshnessBadge freshness={relatedTerms.freshness} source={relatedTerms.source} />
      </Header>
      
      {hasData ? (
        <TermsList>
          {relatedTerms.terms.map((term, index) => (
            <TermItem key={index}>
              <TermText>{term.term}</TermText>
              <TermMeta>
                <span>관련도: {formatRelevance(term.relevance)}</span>
                {term.searchVolume && (
                  <span>검색량: {formatSearchVolume(term.searchVolume)}</span>
                )}
                <CopyToClipboard text={term.term} onCopy={() => handleCopy(term.term)}>
                  <CopyButton>복사</CopyButton>
                </CopyToClipboard>
              </TermMeta>
            </TermItem>
          ))}
        </TermsList>
      ) : (
        <EmptyState>
          {relatedTerms.freshness === 'processing' 
            ? '연관 검색어를 수집 중입니다...' 
            : '연관 검색어가 없습니다.'
          }
        </EmptyState>
      )}
    </Card>
  );
}
