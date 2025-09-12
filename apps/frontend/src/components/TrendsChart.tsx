'use client';

import styled from '@emotion/styled';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

const ChartContainer = styled.div`
  height: 200px;
  width: 100%;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #6b7280;
  font-size: 0.875rem;
`;

interface TrendsChartProps {
  trends: {
    data: Array<{
      date: string;
      value: number;
    }>;
    freshness: 'fresh' | 'stale' | 'processing';
    source: string;
  };
}

export function TrendsChart({ trends }: TrendsChartProps) {
  const hasData = trends.data && trends.data.length > 0;

  return (
    <Card>
      <Header>
        <Title>검색 트렌드</Title>
        <FreshnessBadge freshness={trends.freshness} source={trends.source} />
      </Header>
      
      {hasData ? (
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('ko-KR');
                }}
                formatter={(value: number) => [value, '검색량']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      ) : (
        <EmptyState>
          {trends.freshness === 'processing' 
            ? '트렌드 데이터를 수집 중입니다...' 
            : '트렌드 데이터가 없습니다.'
          }
        </EmptyState>
      )}
    </Card>
  );
}
