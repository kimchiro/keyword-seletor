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

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #f3f4f6;
  border-radius: 20px;
  font-size: 0.875rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const TagText = styled.span`
  color: #1f2937;
  font-weight: 500;
`;

const TagFrequency = styled.span`
  color: #6b7280;
  font-size: 0.75rem;
`;

const CopyButton = styled.button`
  padding: 0.125rem 0.25rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.625rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const CopyAllButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 1rem;

  &:hover {
    background-color: #059669;
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

interface TagSuggestionsListProps {
  tagSuggestions: {
    tags: Array<{
      tag: string;
      frequency: number;
      category?: string;
    }>;
    freshness: 'fresh' | 'stale' | 'processing';
    source: string;
  };
}

export function TagSuggestionsList({ tagSuggestions }: TagSuggestionsListProps) {
  const hasData = tagSuggestions.tags && tagSuggestions.tags.length > 0;

  const handleCopy = (tag: string) => {
    toast.success(`"${tag}" 복사됨`);
  };

  const handleCopyAll = () => {
    const allTags = tagSuggestions.tags.map(tag => tag.tag).join(', ');
    navigator.clipboard.writeText(allTags);
    toast.success(`모든 태그 복사됨 (${tagSuggestions.tags.length}개)`);
  };

  return (
    <Card>
      <Header>
        <Title>태그 후보</Title>
        <FreshnessBadge freshness={tagSuggestions.freshness} source={tagSuggestions.source} />
      </Header>
      
      {hasData ? (
        <>
          <CopyAllButton onClick={handleCopyAll}>
            모든 태그 복사 ({tagSuggestions.tags.length}개)
          </CopyAllButton>
          <TagsContainer>
            {tagSuggestions.tags.map((tag, index) => (
              <TagItem key={index}>
                <TagText>#{tag.tag}</TagText>
                <TagFrequency>({tag.frequency})</TagFrequency>
                <CopyToClipboard text={tag.tag} onCopy={() => handleCopy(tag.tag)}>
                  <CopyButton>복사</CopyButton>
                </CopyToClipboard>
              </TagItem>
            ))}
          </TagsContainer>
        </>
      ) : (
        <EmptyState>
          {tagSuggestions.freshness === 'processing' 
            ? '태그 후보를 수집 중입니다...' 
            : '태그 후보가 없습니다.'
          }
        </EmptyState>
      )}
    </Card>
  );
}
