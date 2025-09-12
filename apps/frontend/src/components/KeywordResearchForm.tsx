'use client';

import React, { useState } from 'react';
import styled from '@emotion/styled';
import toast from 'react-hot-toast';

const FormContainer = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  align-items: end;
`;

const InputGroup = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

interface KeywordResearchFormProps {
  onKeywordSubmit: (keyword: string) => void;
}

export function KeywordResearchForm({ onKeywordSubmit }: KeywordResearchFormProps) {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      toast.error('키워드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      onKeywordSubmit(keyword.trim());
      toast.success(`"${keyword}" 키워드 분석을 시작합니다.`);
    } catch (error) {
      toast.error('키워드 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <Title>키워드 리서치</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="keyword">분석할 키워드</Label>
          <Input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="예: 가을제철음식"
            disabled={isLoading}
          />
        </InputGroup>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '분석 중...' : '분석 시작'}
        </Button>
      </Form>
    </FormContainer>
  );
}
