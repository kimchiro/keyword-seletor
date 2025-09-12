'use client';

import styled from '@emotion/styled';
import { KeywordResearchForm } from '@/components/KeywordResearchForm';
import { KeywordResults } from '@/components/KeywordResults';
import { useState } from 'react';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  color: white;
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

export default function HomePage() {
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  return (
    <Container>
      <Header>
        <Title>키워드 셀렉터</Title>
        <Subtitle>
          D.I.A 관점의 검색 의도 충족 글쓰기를 위한 네이버 블로그 키워드 리서치 도구
        </Subtitle>
      </Header>

      <MainContent>
        <Card>
          <KeywordResearchForm onKeywordSubmit={setSelectedKeyword} />
          {selectedKeyword && <KeywordResults keyword={selectedKeyword} />}
        </Card>
      </MainContent>
    </Container>
  );
}
