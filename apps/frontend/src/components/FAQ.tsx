'use client';

import React, { useState } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Subtitle = styled.p`
  color: #718096;
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e0;
  }
`;

const Question = styled.button`
  width: 100%;
  padding: 1.5rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  transition: all 0.3s ease;

  &:hover {
    background: #f7fafc;
  }
`;

const QuestionText = styled.span`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const QuestionIcon = styled.span`
  font-size: 1.2rem;
`;

const ExpandIcon = styled.span<{ isOpen: boolean }>`
  font-size: 1.2rem;
  color: #667eea;
  transform: rotate(${({ isOpen }) => (isOpen ? '180deg' : '0deg')});
  transition: transform 0.3s ease;
`;

const Answer = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? '1000px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const AnswerContent = styled.div`
  padding: 0 1.5rem 1.5rem 1.5rem;
  color: #4a5568;
  line-height: 1.7;
  font-size: 0.95rem;

  h4 {
    font-weight: 600;
    color: #2d3748;
    margin: 1rem 0 0.5rem 0;
    font-size: 1rem;
  }

  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.3rem 0;
  }

  code {
    background: #edf2f7;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
    color: #667eea;
  }

  .highlight {
    background: #fef5e7;
    padding: 1rem;
    border-left: 4px solid #f6ad55;
    border-radius: 0 8px 8px 0;
    margin: 1rem 0;
  }

  .security-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: #c6f6d5;
    color: #22543d;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    margin: 0.5rem 0;
  }
`;

interface FAQItemData {
  id: string;
  icon: string;
  question: string;
  answer: string;
}

const faqData: FAQItemData[] = [
  {
    id: 'api-key-storage',
    icon: '🔐',
    question: 'API 키는 어떻게 보관되나요?',
    answer: `
      <div class="security-badge">🛡️ 보안 우선 설계</div>
      
      <h4>메모리 기반 임시 저장</h4>
      <ul>
        <li>API 키는 서버의 <code>메모리(RAM)</code>에만 임시 저장됩니다</li>
        <li>데이터베이스나 파일 시스템에 영구 저장되지 않습니다</li>
        <li>서버 재시작 시 모든 API 키 정보가 자동으로 삭제됩니다</li>
      </ul>

      <h4>세션 기반 관리</h4>
      <ul>
        <li>API 키 등록 후 <strong>30분 세션</strong>으로 관리됩니다</li>
        <li>세션 만료 시 자동으로 메모리에서 제거됩니다</li>
        <li>브라우저를 닫거나 새로고침해도 키 정보는 유지됩니다 (세션 시간 내)</li>
      </ul>

      <div class="highlight">
        <strong>💡 보안 팁:</strong> 공용 컴퓨터 사용 시에는 작업 완료 후 브라우저를 완전히 종료하시기 바랍니다.
      </div>
    `
  },
  {
    id: 'api-key-source',
    icon: '🔑',
    question: '네이버 API 키는 어디서 발급받나요?',
    answer: `
      <h4>네이버 개발자 센터에서 발급</h4>
      
      <h4>1단계: 네이버 개발자 센터 접속</h4>
      <ul>
        <li>🌐 <strong>developers.naver.com</strong> 접속</li>
        <li>네이버 계정으로 로그인</li>
      </ul>

      <h4>2단계: 애플리케이션 등록</h4>
      <ul>
        <li>📱 &quot;Application&quot; → &quot;애플리케이션 등록&quot; 클릭</li>
        <li>애플리케이션 이름 입력 (예: 키워드 리서치 도구)</li>
        <li><strong>검색</strong> API 선택 (필수)</li>
        <li>환경 설정: <code>WEB</code> 선택</li>
      </ul>

      <h4>3단계: API 키 확인</h4>
      <ul>
        <li>🔑 <strong>Client ID</strong>: 애플리케이션 식별자</li>
        <li>🔒 <strong>Client Secret</strong>: 보안 키 (외부 노출 금지)</li>
      </ul>

      <div class="highlight">
        <strong>⚠️ 주의사항:</strong> Client Secret은 절대 공개하지 마세요. 깃허브 등 공개 저장소에 업로드하면 보안 위험이 있습니다.
      </div>

      <h4>4단계: 서비스 환경 설정</h4>
      <ul>
        <li>서비스 URL: 실제 사용할 도메인 등록</li>
        <li>개발 중에는 <code>localhost</code> 등록 가능</li>
      </ul>
    `
  },
  {
    id: 'data-storage',
    icon: '💾',
    question: '검색한 데이터는 어떻게 저장되나요?',
    answer: `
      <h4>로컬 스토리지 기반 저장</h4>
      
      <h4>클라이언트 측 저장</h4>
      <ul>
        <li>🖥️ 검색 결과는 <strong>브라우저의 로컬 스토리지</strong>에 저장됩니다</li>
        <li>서버에는 검색 데이터가 저장되지 않습니다</li>
        <li>개인정보 보호 및 프라이버시 보장</li>
      </ul>

      <h4>저장되는 데이터</h4>
      <ul>
        <li>📊 키워드별 검색량 데이터 (PC/모바일)</li>
        <li>📈 경쟁률 및 문서 수 정보</li>
        <li>🔗 연관 키워드 및 태그 제안</li>
        <li>⏰ 검색 날짜 및 시간</li>
      </ul>

      <h4>데이터 관리</h4>
      <ul>
        <li><strong>조회 기록</strong> 탭에서 저장된 데이터 확인 가능</li>
        <li>📋 개별 키워드 복사 기능 제공</li>
        <li>🗑️ 브라우저 설정에서 로컬 스토리지 삭제 가능</li>
      </ul>

      <div class="highlight">
        <strong>🔒 프라이버시:</strong> 모든 검색 데이터는 사용자의 브라우저에만 저장되며, 외부로 전송되지 않습니다.
      </div>

      <h4>데이터 백업 및 이동</h4>
      <ul>
        <li>브라우저 캐시 삭제 시 데이터 손실 가능</li>
        <li>중요한 데이터는 별도로 복사하여 보관 권장</li>
        <li>다른 브라우저나 기기에서는 데이터 공유 안됨</li>
      </ul>
    `
  },
  {
    id: 'api-limits',
    icon: '⚡',
    question: 'API 사용량 제한이 있나요?',
    answer: `
      <h4>네이버 검색 API 제한사항</h4>
      
      <h4>일일 호출 제한</h4>
      <ul>
        <li>📊 <strong>25,000회/일</strong> 호출 제한</li>
        <li>초당 최대 10회 호출 가능</li>
        <li>제한 초과 시 일시적 사용 중단</li>
      </ul>

      <h4>무한반복 조회 최적화</h4>
      <ul>
        <li>🔄 중복 키워드 자동 스킵으로 API 호출 절약</li>
        <li>⏱️ 적절한 호출 간격으로 제한 방지</li>
        <li>📈 효율적인 키워드 탐색 알고리즘 적용</li>
      </ul>

      <h4>사용량 모니터링</h4>
      <ul>
        <li>네이버 개발자 센터에서 실시간 사용량 확인</li>
        <li>일일 사용량 그래프 제공</li>
        <li>제한 근접 시 알림 기능</li>
      </ul>

      <div class="highlight">
        <strong>💡 효율적 사용 팁:</strong> 키워드 조회 전에 검색 범위를 적절히 설정하여 불필요한 API 호출을 줄이세요.
      </div>
    `
  },
  {
    id: 'troubleshooting',
    icon: '🔧',
    question: '문제가 발생했을 때 어떻게 해결하나요?',
    answer: `
      <h4>일반적인 문제 해결</h4>
      
      <h4>API 연결 문제</h4>
      <ul>
        <li>🔑 Client ID와 Client Secret 재확인</li>
        <li>네이버 개발자 센터에서 API 상태 확인</li>
        <li>서비스 URL 설정 확인</li>
        <li>브라우저 새로고침 후 재시도</li>
      </ul>

      <h4>검색 결과 없음</h4>
      <ul>
        <li>📝 키워드 철자 및 띄어쓰기 확인</li>
        <li>너무 구체적이거나 생소한 키워드 피하기</li>
        <li>일반적인 키워드로 테스트해보기</li>
      </ul>

      <h4>성능 문제</h4>
      <ul>
        <li>⚡ 브라우저 캐시 및 쿠키 정리</li>
        <li>다른 탭 닫기로 메모리 확보</li>
        <li>안정적인 인터넷 연결 확인</li>
      </ul>

      <div class="highlight">
        <strong>🆘 지속적인 문제:</strong> 위 방법으로 해결되지 않는 경우, 브라우저 개발자 도구(F12)의 콘솔 탭에서 오류 메시지를 확인해보세요.
      </div>

      <h4>데이터 손실 방지</h4>
      <ul>
        <li>💾 중요한 검색 결과는 즉시 복사하여 저장</li>
        <li>정기적으로 조회 기록 백업</li>
        <li>브라우저 업데이트 전 데이터 확인</li>
      </ul>
    `
  }
];

export function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <Container>
      <Title>
        ❓ 자주묻는질문
      </Title>
      <Subtitle>
        캐치 키워드 사용 중 궁금한 점들을 모아놨습니다. 
        API 키 관리, 데이터 저장 방식, 문제 해결 방법 등을 확인해보세요.
      </Subtitle>

      <FAQList>
        {faqData.map((item) => (
          <FAQItem key={item.id}>
            <Question onClick={() => toggleItem(item.id)}>
              <QuestionText>
                <QuestionIcon>{item.icon}</QuestionIcon>
                {item.question}
              </QuestionText>
              <ExpandIcon isOpen={openItems.includes(item.id)}>
                ▼
              </ExpandIcon>
            </Question>
            <Answer isOpen={openItems.includes(item.id)}>
              <AnswerContent 
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </Answer>
          </FAQItem>
        ))}
      </FAQList>
    </Container>
  );
}
