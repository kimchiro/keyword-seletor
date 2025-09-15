'use client';

import React, { useState } from 'react';
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
  position: relative;
`;

const DesktopNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileNavigation = styled.div`
  display: none;
  width: 100%;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const HamburgerButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  
  span {
    width: 30px;
    height: 3px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 2px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transform: translateY(${({ isOpen }) => (isOpen ? '0' : '-10px')});
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  z-index: 1000;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const MobileMenuTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #718096;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileTabButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const MobileStatusWrapper = styled.div`
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
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

const MobileTabButton = styled.button<{ active: boolean }>`
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  text-align: left;
  
  ${({ active }) =>
    active
      ? `
        background: #667eea;
        color: white;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      `
      : `
        background: #f7fafc;
        color: #2d3748;
        
        &:hover {
          background: #edf2f7;
        }
      `}
`;

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: 'search-history' | 'bulk-research' | 'settings') => {
    onTabChange(tab);
    setIsMobileMenuOpen(false); // 모바일에서 탭 선택 시 메뉴 닫기
  };

  return (
    <NavigationContainer>
      {/* 데스크톱 네비게이션 */}
      <DesktopNavigation>
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
      </DesktopNavigation>

      {/* 모바일 네비게이션 */}
      <MobileNavigation>
        <HamburgerButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span />
          <span />
          <span />
        </HamburgerButton>

        <MobileMenu isOpen={isMobileMenuOpen}>
          <MobileMenuHeader>
            <MobileMenuTitle>메뉴</MobileMenuTitle>
            <CloseButton onClick={() => setIsMobileMenuOpen(false)}>
              ×
            </CloseButton>
          </MobileMenuHeader>

          <MobileTabButtonGroup>
            <MobileTabButton
              active={activeTab === 'search-history'}
              onClick={() => handleTabChange('search-history')}
            >
              📋 조회 기록
            </MobileTabButton>
            <MobileTabButton
              active={activeTab === 'bulk-research'}
              onClick={() => handleTabChange('bulk-research')}
            >
              🔄 무한반복 조회
            </MobileTabButton>
            <MobileTabButton
              active={activeTab === 'settings'}
              onClick={() => handleTabChange('settings')}
            >
              환경설정
            </MobileTabButton>
          </MobileTabButtonGroup>

          <MobileStatusWrapper>
            <ApiKeyStatusIndicator />
          </MobileStatusWrapper>
        </MobileMenu>
      </MobileNavigation>
    </NavigationContainer>
  );
}
