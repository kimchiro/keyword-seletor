'use client';

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useApiKeyStatus } from '@/hooks/useApiKeyStatus';

interface ApiKeyStatusIndicatorProps {
  className?: string;
}

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatusIndicator = styled.div<{ isConnected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.isConnected ? '#10b981' : '#ef4444'};
`;

const StatusDot = styled.div<{ isConnected: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.isConnected ? '#10b981' : '#ef4444'};
  box-shadow: 0 0 8px ${props => props.isConnected ? '#10b98140' : '#ef444440'};
  animation: ${props => props.isConnected ? 'pulse-green' : 'pulse-red'} 2s infinite;

  @keyframes pulse-green {
    0%, 100% {
      box-shadow: 0 0 8px #10b98140;
    }
    50% {
      box-shadow: 0 0 16px #10b98160;
    }
  }

  @keyframes pulse-red {
    0%, 100% {
      box-shadow: 0 0 8px #ef444440;
    }
    50% {
      box-shadow: 0 0 16px #ef444460;
    }
  }
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const TimerLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`;

const TimerDisplay = styled.div<{ isExpiring: boolean }>`
  font-size: 14px;
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', monospace;
  color: ${props => props.isExpiring ? '#ef4444' : '#374151'};
  min-width: 80px;
  text-align: center;
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: rgba(107, 114, 128, 0.3);
`;

export function ApiKeyStatusIndicator({ className }: ApiKeyStatusIndicatorProps) {
  const { isConnected, isLoading } = useApiKeyStatus();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [sessionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    // API 키 세션 만료 시간 (30분 = 1800초)
    const SESSION_DURATION = 30 * 60; // 30분
    
    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
      const remaining = Math.max(0, SESSION_DURATION - elapsed);
      setTimeRemaining(remaining);
    };

    // 초기 설정
    updateTimer();

    // 1초마다 업데이트
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isExpiring = timeRemaining <= 300; // 5분 이하일 때 경고 표시

  if (isLoading) {
    return (
      <StatusContainer className={className}>
        <StatusIndicator isConnected={false}>
          <StatusDot isConnected={false} />
          연결 확인 중...
        </StatusIndicator>
      </StatusContainer>
    );
  }

  return (
    <StatusContainer className={className}>
      <StatusIndicator isConnected={isConnected}>
        <StatusDot isConnected={isConnected} />
        {isConnected ? 'API 연결됨' : 'API 미연결'}
      </StatusIndicator>
      
      <Divider />
      
      <TimerContainer>
        <TimerLabel>세션 만료</TimerLabel>
        <TimerDisplay isExpiring={isExpiring}>
          {timeRemaining > 0 ? formatTime(timeRemaining) : '만료됨'}
        </TimerDisplay>
      </TimerContainer>
    </StatusContainer>
  );
}
