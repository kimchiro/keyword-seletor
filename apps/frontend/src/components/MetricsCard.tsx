'use client';

import styled from '@emotion/styled';
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
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
`;

const MetricItem = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const MetricValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
`;

const CompetitionBadge = styled.span<{ level: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  
  ${({ level }) => {
    switch (level) {
      case 'HIGH':
        return 'background-color: #fef2f2; color: #dc2626;';
      case 'MEDIUM':
        return 'background-color: #fef3c7; color: #d97706;';
      case 'LOW':
        return 'background-color: #f0fdf4; color: #16a34a;';
      default:
        return 'background-color: #f3f4f6; color: #6b7280;';
    }
  }}
`;

interface MetricsCardProps {
  metrics: {
    searchVolume: number | null;
    competition: 'HIGH' | 'MEDIUM' | 'LOW' | null;
    competitionIndex: number | null;
    freshness: 'fresh' | 'stale' | 'processing';
    source: string;
  };
}

export function MetricsCard({ metrics }: MetricsCardProps) {
  const formatSearchVolume = (volume: number | null) => {
    if (volume === null) return '데이터 없음';
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toLocaleString();
  };

  return (
    <Card>
      <Header>
        <Title>검색량 & 경쟁도</Title>
        <FreshnessBadge freshness={metrics.freshness} source={metrics.source} />
      </Header>
      
      <MetricItem>
        <MetricLabel>월 검색량</MetricLabel>
        <MetricValue>{formatSearchVolume(metrics.searchVolume)}</MetricValue>
      </MetricItem>
      
      <MetricItem>
        <MetricLabel>경쟁도</MetricLabel>
        <MetricValue>
          {metrics.competition ? (
            <CompetitionBadge level={metrics.competition}>
              {metrics.competition}
            </CompetitionBadge>
          ) : (
            '데이터 없음'
          )}
        </MetricValue>
      </MetricItem>
      
      <MetricItem>
        <MetricLabel>경쟁도 지수</MetricLabel>
        <MetricValue>
          {metrics.competitionIndex !== null 
            ? `${metrics.competitionIndex}/100` 
            : '데이터 없음'
          }
        </MetricValue>
      </MetricItem>
    </Card>
  );
}
