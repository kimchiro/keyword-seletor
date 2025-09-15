'use client';

import React from 'react';
import styled from '@emotion/styled';
import { ApiKeyStatusIndicator } from './ApiKeyStatusIndicator';

interface NavigationProps {
  activeTab: 'search-history' | 'bulk-research' | 'settings';
  onTabChange: (tab: 'search-history' | 'bulk-research' | 'settings') => void;
}

const NavigationContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: flex-start;
  
  @media (max-width: 768px) {
    display: none;
  }
`;


const TabButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const StatusIndicatorWrapper = styled.div`
  margin-left: auto;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  
  ${({ active }) =>
    active
      ? `
        background: rgba(255, 255, 255, 0.2);
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      `
      : `
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.8);
        
        &:hover {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }
      `}
`;


export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <NavigationContainer>
      <TabButtonGroup>
        <TabButton
          active={activeTab === 'search-history'}
          onClick={() => onTabChange('search-history')}
        >
          📋 조회 기록
        </TabButton>
        <TabButton
          active={activeTab === 'bulk-research'}
          onClick={() => onTabChange('bulk-research')}
        >
          🔄 무한반복 조회
        </TabButton>
        <TabButton
          active={activeTab === 'settings'}
          onClick={() => onTabChange('settings')}
        >
          환경설정
        </TabButton>
      </TabButtonGroup>
      
      <StatusIndicatorWrapper>
        <ApiKeyStatusIndicator />
      </StatusIndicatorWrapper>
    </NavigationContainer>
  );
}
