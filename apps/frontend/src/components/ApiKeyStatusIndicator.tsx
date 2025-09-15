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
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 40px;
  min-width: 200px;
`;

const StatusIndicator = styled.div<{ isConnected: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.isConnected ? '#10b981' : '#ef4444'};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
`;

const StatusDot = styled.div<{ isConnected: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.isConnected ? '#10b981' : '#ef4444'};
  box-shadow: 0 0 6px ${props => props.isConnected ? '#10b98140' : '#ef444440'};
  animation: ${props => props.isConnected ? 'pulse-green' : 'pulse-red'} 2s infinite;
  flex-shrink: 0;

  @keyframes pulse-green {
    0%, 100% {
      box-shadow: 0 0 6px #10b98140;
    }
    50% {
      box-shadow: 0 0 12px #10b98160;
    }
  }

  @keyframes pulse-red {
    0%, 100% {
      box-shadow: 0 0 6px #ef444440;
    }
    50% {
      box-shadow: 0 0 12px #ef444460;
    }
  }
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const TimerLabel = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
`;

const TimerDisplay = styled.div<{ isExpiring: boolean }>`
  font-size: 12px;
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', monospace;
  color: ${props => props.isExpiring ? '#ef4444' : 'rgba(255, 255, 255, 0.9)'};
  min-width: 60px;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
`;

export function ApiKeyStatusIndicator({ className }: ApiKeyStatusIndicatorProps) {
  const { isConnected, isLoading } = useApiKeyStatus();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  useEffect(() => {
    // API가 연결된 경우에만 세션 타이머 시작
    if (isConnected && !sessionStartTime) {
      setSessionStartTime(Date.now());
    } else if (!isConnected) {
      setSessionStartTime(null);
      setTimeRemaining(0);
    }
  }, [isConnected, sessionStartTime]);

  useEffect(() => {
    // API가 연결되고 세션이 시작된 경우에만 타이머 실행
    if (!isConnected || !sessionStartTime) {
      return;
    }

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
  }, [isConnected, sessionStartTime]);

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
      
      {isConnected && (
        <>
          <Divider />
          <TimerContainer>
            <TimerLabel>세션 만료</TimerLabel>
            <TimerDisplay isExpiring={isExpiring}>
              {timeRemaining > 0 ? formatTime(timeRemaining) : '만료됨'}
            </TimerDisplay>
          </TimerContainer>
        </>
      )}
    </StatusContainer>
  );
}
