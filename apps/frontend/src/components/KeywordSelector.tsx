'use client';

import styled from '@emotion/styled';
import { KeywordResearchForm } from '@/components/KeywordResearchForm';
import { KeywordResults } from '@/components/KeywordResults';
import { useState } from 'react';

const KeywordSelectorContainer = styled.div`
  padding: 2rem;
`;

// const Title = styled.h2`
//   font-size: 1.5rem;
//   font-weight: 700;
//   margin-bottom: 1.5rem;
//   color: #333;
// `;

export function KeywordSelector() {
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  return (
    <KeywordSelectorContainer>
      <KeywordResearchForm onKeywordSubmit={setSelectedKeyword} />
      {selectedKeyword && <KeywordResults keyword={selectedKeyword} />}
    </KeywordSelectorContainer>
  );
}
