'use client';

import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`;

const Icon = styled.div`
  width: 48px;
  height: 48px;
  background-color: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 0.5rem;
`;

const Message = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  max-width: 400px;
`;

interface ErrorMessageProps {
  title?: string;
  message: string;
}

export function ErrorMessage({ 
  title = '오류 발생', 
  message 
}: ErrorMessageProps) {
  return (
    <Container>
      <Icon>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </Icon>
      <Title>{title}</Title>
      <Message>{message}</Message>
    </Container>
  );
}
