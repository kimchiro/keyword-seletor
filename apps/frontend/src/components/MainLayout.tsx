'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
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

const StatusIndicatorWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
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

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
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
        <StatusIndicatorWrapper>
          <ApiKeyStatusIndicator />
        </StatusIndicatorWrapper>
        <Title>캐치 키워드</Title>
        <Subtitle>
          D.I.A 관점의 검색 의도 충족 글쓰기를 위한 네이버 블로그 키워드 리서치 도구
        </Subtitle>
      </Header>

      <MainContent>
        <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
        {activeTab === 'bulk-research' ? (
          renderContent()
        ) : (
          <Card>
            {renderContent()}
          </Card>
        )}
      </MainContent>
    </Container>
  );
}
