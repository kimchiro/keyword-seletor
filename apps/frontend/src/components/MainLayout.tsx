'use client';

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Navigation } from './Navigation';
import { SearchHistory } from './SearchHistory';
import { BulkKeywordResearch } from './BulkKeywordResearch';
import { Settings } from './Settings';
import { ApiKeyStatusIndicator } from './ApiKeyStatusIndicator';


const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  color: white;
  position: relative;
`;

const MobileMenuButton = styled.button`
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 30px;
  }
  
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
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 80px;
    right: 2rem;
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
    min-width: 200px;
  }
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

const MobileStatusWrapper = styled.div`
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

type ActiveTab = 'search-history' | 'bulk-research' | 'settings';

export function MainLayout() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('search-history');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // 모바일에서 탭 선택 시 메뉴 닫기
    // bulk-research 탭으로 전환할 때 API 키 상태 새로고침
    if (tab === 'bulk-research') {
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'search-history':
        return <SearchHistory />;
      case 'bulk-research':
        return <BulkKeywordResearch 
          onNavigateToSettings={() => setActiveTab('settings')} 
          refreshTrigger={refreshTrigger}
        />;
      case 'settings':
        return <Settings />;
      default:
        return <SearchHistory />;
    }
  };

  return (
    <Container>
      <Header>
        <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span />
          <span />
          <span />
        </MobileMenuButton>
        
        <Title>캐치 키워드</Title>
        <Subtitle>
          D.I.A 관점의 검색 의도 충족 글쓰기를 위한 네이버 블로그 키워드 리서치 도구
        </Subtitle>

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
      </Header>

      <MainContent>
        <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
        <Card>
          {renderContent()}
        </Card>
      </MainContent>
    </Container>
  );
}
