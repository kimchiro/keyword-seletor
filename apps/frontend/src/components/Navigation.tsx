'use client';

import styled from '@emotion/styled';

interface NavigationProps {
  activeTab: 'keyword-selector' | 'settings';
  onTabChange: (tab: 'keyword-selector' | 'settings') => void;
}

const NavigationContainer = styled.nav`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
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
      <TabButton
        active={activeTab === 'keyword-selector'}
        onClick={() => onTabChange('keyword-selector')}
      >
        키워드셀렉터
      </TabButton>
      <TabButton
        active={activeTab === 'settings'}
        onClick={() => onTabChange('settings')}
      >
        환경설정
      </TabButton>
    </NavigationContainer>
  );
}
