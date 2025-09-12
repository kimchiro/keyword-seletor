'use client';

import styled from '@emotion/styled';

const Badge = styled.span<{ freshness: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ freshness }) => {
    switch (freshness) {
      case 'fresh':
        return 'background-color: #f0fdf4; color: #16a34a;';
      case 'stale':
        return 'background-color: #fef3c7; color: #d97706;';
      case 'processing':
        return 'background-color: #eff6ff; color: #2563eb;';
      default:
        return 'background-color: #f3f4f6; color: #6b7280;';
    }
  }}
`;

const Dot = styled.span<{ freshness: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 0.375rem;
  
  ${({ freshness }) => {
    switch (freshness) {
      case 'fresh':
        return 'background-color: #16a34a;';
      case 'stale':
        return 'background-color: #d97706;';
      case 'processing':
        return 'background-color: #2563eb;';
      default:
        return 'background-color: #6b7280;';
    }
  }}
`;

interface FreshnessBadgeProps {
  freshness: 'fresh' | 'stale' | 'processing';
  source: string;
}

export function FreshnessBadge({ freshness, source }: FreshnessBadgeProps) {
  const getFreshnessText = (freshness: string) => {
    switch (freshness) {
      case 'fresh':
        return '최신';
      case 'stale':
        return '이전 데이터';
      case 'processing':
        return '처리 중';
      default:
        return '알 수 없음';
    }
  };

  return (
    <Badge freshness={freshness} title={`출처: ${source}`}>
      <Dot freshness={freshness} />
      {getFreshnessText(freshness)}
    </Badge>
  );
}
