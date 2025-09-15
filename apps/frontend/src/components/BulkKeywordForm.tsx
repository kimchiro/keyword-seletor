'use client';

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useApiKeyStatus } from '@/hooks/useApiKeyStatus';
import { useToast } from './Toast';

interface BulkKeywordFormProps {
  onSubmit: (data: { initialKeyword: string; searchCount: number }) => void;
  isLoading: boolean;
  onNavigateToSettings?: () => void;
  refreshTrigger?: number; // 외부에서 새로고침을 트리거하기 위한 prop
}

const FormContainer = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Description = styled.p`
  color: #718096;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
`;

const Input = styled.input<{ disabled?: boolean }>`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const NumberInput = styled(Input)`
  max-width: 200px;
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    background: #cbd5e0;
  }
`;

const HelpText = styled.small`
  color: #718096;
  font-size: 0.8rem;
`;

const ApiKeyWarning = styled.div`
  padding: 1rem 1.5rem;
  background: #fffbeb;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const WarningIcon = styled.div`
  font-size: 1.25rem;
  color: #ed8936;
`;

const WarningContent = styled.div`
  flex: 1;
`;

const WarningTitle = styled.div`
  font-weight: 600;
  color: #9c4221;
  margin-bottom: 0.25rem;
`;

const WarningText = styled.div`
  font-size: 0.9rem;
  color: #9c4221;
  line-height: 1.4;
`;

const SettingsLink = styled.button`
  background: none;
  border: none;
  color: #3182ce;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    color: #2b6cb0;
  }
`;

const FlexRow = styled.div`
  display: flex;
  gap: 2rem;
  align-items: end;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }
`;

export function BulkKeywordForm({ onSubmit, isLoading, onNavigateToSettings, refreshTrigger }: BulkKeywordFormProps) {
  const [initialKeyword, setInitialKeyword] = useState('');
  const [searchCount, setSearchCount] = useState(10);
  const { isConnected, isLoading: apiKeyLoading, refetch } = useApiKeyStatus();
  const { showToast } = useToast();

  // refreshTrigger가 변경될 때마다 API 키 상태 새로고침 (초기값 0은 제외)
  React.useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // API 키 연결 상태 확인
    if (!isConnected) {
      showToast(
        'API 키가 연결되지 않았습니다. 환경설정에서 네이버 API 키를 먼저 설정해주세요.',
        'warning',
        7000
      );
      return;
    }
    
    if (initialKeyword.trim() && searchCount > 0 && searchCount <= 100) {
      onSubmit({ initialKeyword: initialKeyword.trim(), searchCount });
    }
  };

  const isFormDisabled = isLoading || apiKeyLoading || !isConnected;

  return (
    <FormContainer>
      <Title>🔄 키워드 무한반복 조회</Title>
      <Description>
        초기 키워드를 입력하면 연관 키워드를 자동으로 찾아 지정된 개수만큼 반복 조회합니다.
        <br />
        중복 키워드는 자동으로 건너뛰며, PC/모바일 검색량, 문서수, 경쟁률을 제공합니다.
      </Description>

      {!apiKeyLoading && !isConnected && (
        <ApiKeyWarning>
          <WarningIcon>⚠️</WarningIcon>
          <WarningContent>
            <WarningTitle>API 키 연결 필요</WarningTitle>
            <WarningText>
              키워드 조회를 위해서는 네이버 API 키 연결이 필요합니다.{' '}
              <SettingsLink onClick={onNavigateToSettings}>
                환경설정에서 API 키를 설정
              </SettingsLink>
              해주세요.
            </WarningText>
          </WarningContent>
        </ApiKeyWarning>
      )}

      <Form onSubmit={handleSubmit}>
        <FlexRow>
          <InputGroup style={{ flex: 1 }}>
            <Label htmlFor="initialKeyword">초기 키워드</Label>
            <Input
              id="initialKeyword"
              type="text"
              value={initialKeyword}
              onChange={(e) => setInitialKeyword(e.target.value)}
              placeholder="예: 가을제철음식"
              disabled={isFormDisabled}
              required
            />
            <HelpText>이 키워드로부터 연관 키워드를 찾아 확장 조회합니다</HelpText>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="searchCount">조회할 키워드 개수</Label>
            <NumberInput
              id="searchCount"
              type="number"
              min="1"
              max="100"
              value={searchCount}
              onChange={(e) => setSearchCount(parseInt(e.target.value) || 1)}
              disabled={isFormDisabled}
              required
            />
            <HelpText>최대 100개까지 가능</HelpText>
          </InputGroup>
        </FlexRow>

        <SubmitButton type="submit" disabled={isFormDisabled || !initialKeyword.trim()}>
          {isLoading ? (
            <>
              ⏳ 키워드 조회 중...
            </>
          ) : !isConnected ? (
            <>
              🔒 API 키 연결 필요
            </>
          ) : (
            <>
              🚀 조회 시작
            </>
          )}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
}
