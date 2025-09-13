'use client';

import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { settingsApi } from '../lib/api';

const SettingsContainer = styled.div`
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const GuideSection = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const GuideTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const GuideText = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const GuideLink = styled.a`
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${({ variant = 'primary' }) =>
    variant === 'primary'
      ? `
        background: #667eea;
        color: white;
        
        &:hover {
          background: #5a6fd8;
        }
      `
      : `
        background: #f8f9fa;
        color: #666;
        border: 1px solid #e9ecef;
        
        &:hover {
          background: #e9ecef;
        }
      `}
`;

interface ApiKeys {
  clientId: string;
  clientSecret: string;
  customerId: string;
}

interface ApiKeysStatus {
  isConfigured: boolean;
  hasClientId: boolean;
  hasClientSecret: boolean;
  hasCustomerId: boolean;
  clientIdMasked: string;
  clientSecretMasked: string;
  customerIdMasked: string;
}

export function Settings() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    clientId: '',
    clientSecret: '',
    customerId: '',
  });
  const [apiKeysStatus, setApiKeysStatus] = useState<ApiKeysStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // 컴포넌트 마운트 시 백엔드에서 API 키 상태 불러오기
  useEffect(() => {
    loadApiKeysStatus();
  }, []);

  const loadApiKeysStatus = async () => {
    try {
      const status = await settingsApi.getApiKeysStatus();
      setApiKeysStatus(status);
      
      // 마스킹된 값을 표시용으로 설정 (실제 편집시에는 빈 값으로 시작)
      setApiKeys({
        clientId: '',
        clientSecret: '',
        customerId: '',
      });
    } catch (error) {
      console.error('API 키 상태 로드 실패:', error);
      toast.error('API 키 상태를 불러오는데 실패했습니다.');
    }
  };

  const handleInputChange = (field: keyof ApiKeys, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // 모든 필드가 필수값인지 확인
    if (!apiKeys.clientId?.trim()) {
      toast.error('네이버 클라이언트 ID를 입력해주세요.');
      return;
    }
    if (!apiKeys.clientSecret?.trim()) {
      toast.error('네이버 클라이언트 시크릿을 입력해주세요.');
      return;
    }
    if (!apiKeys.customerId?.trim()) {
      toast.error('네이버 고객 ID를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await settingsApi.updateApiKeys({
        clientId: apiKeys.clientId.trim(),
        clientSecret: apiKeys.clientSecret.trim(),
        customerId: apiKeys.customerId.trim(),
      });
      
      setApiKeysStatus(result);
      setApiKeys({ clientId: '', clientSecret: '', customerId: '' }); // 입력 필드 초기화
      toast.success('API 키가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('API 키 저장 실패:', error);
      toast.error('API 키 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    if (!apiKeysStatus?.isConfigured) {
      toast.error('API 키가 저장되어야만 테스트를 할 수 있습니다.');
      return;
    }

    setIsTesting(true);
    try {
      const result = await settingsApi.testApiKeys();
      if (result.isValid) {
        toast.success('✅ API가 정상적으로 연결되었습니다!');
      } else {
        toast.error('❌ 유효하지 않은 키 값입니다. API가 연결되지 않았습니다.');
      }
    } catch (error) {
      console.error('API 키 테스트 실패:', error);
      toast.error('❌ API 연결에 실패했습니다. 키 값을 확인해주세요.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!apiKeysStatus?.isConfigured) {
      toast.error('연결된 API 키가 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await settingsApi.disconnectApiKeys();
      setApiKeysStatus(result);
      setApiKeys({ clientId: '', clientSecret: '', customerId: '' }); // 입력 필드도 초기화
      toast.success('API 연결이 끊어졌습니다.');
    } catch (error) {
      console.error('API 연결 끊기 실패:', error);
      toast.error('API 연결 끊기에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setApiKeys({
      clientId: '',
      clientSecret: '',
      customerId: '',
    });
    toast.success('입력 필드가 초기화되었습니다.');
  };

  return (
    <SettingsContainer>
      <Title>네이버 API 키 설정</Title>
      
      {apiKeysStatus && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: apiKeysStatus.isConfigured ? '#d4edda' : '#f8d7da', borderRadius: '8px' }}>
          <strong>현재 상태:</strong> {apiKeysStatus.isConfigured ? '✅ 모든 API 키가 설정됨' : '❌ API 키 설정 필요'}
          {apiKeysStatus.isConfigured && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
              <div>클라이언트 ID: {apiKeysStatus.clientIdMasked}</div>
              <div>클라이언트 시크릿: {apiKeysStatus.clientSecretMasked}</div>
              <div>고객 ID: {apiKeysStatus.customerIdMasked}</div>
            </div>
          )}
        </div>
      )}
      
      <FormGroup>
        <Label htmlFor="clientId">NAVER_CLIENT_ID *</Label>
        <Input
          id="clientId"
          type="text"
          placeholder="네이버 클라이언트 ID를 입력하세요 (필수)"
          value={apiKeys.clientId}
          onChange={(e) => handleInputChange('clientId', e.target.value)}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="clientSecret">NAVER_CLIENT_SECRET *</Label>
        <Input
          id="clientSecret"
          type="password"
          placeholder="네이버 클라이언트 시크릿을 입력하세요 (필수)"
          value={apiKeys.clientSecret}
          onChange={(e) => handleInputChange('clientSecret', e.target.value)}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="customerId">NAVER_CUSTOMER_ID *</Label>
        <Input
          id="customerId"
          type="text"
          placeholder="네이버 고객 ID를 입력하세요 (필수)"
          value={apiKeys.customerId}
          onChange={(e) => handleInputChange('customerId', e.target.value)}
          required
        />
      </FormGroup>

      <ButtonGroup>
        <Button variant="primary" onClick={handleSave} disabled={isLoading}>
          {isLoading ? '저장 중...' : '저장'}
        </Button>
        <Button variant="secondary" onClick={handleTest} disabled={isTesting || !apiKeysStatus?.isConfigured}>
          {isTesting ? '테스트 중...' : 'API 연결 테스트'}
        </Button>
        {apiKeysStatus?.isConfigured ? (
          <Button variant="secondary" onClick={handleDisconnect} disabled={isLoading}>
            {isLoading ? '연결 끊는 중...' : '연결 끊기'}
          </Button>
        ) : (
          <Button variant="secondary" onClick={handleReset}>
            입력 초기화
          </Button>
        )}
      </ButtonGroup>

      <GuideSection>
        <GuideTitle>API 키 발급 가이드</GuideTitle>
        <GuideText>
          네이버 API를 사용하기 위해서는 네이버 개발자 센터에서 애플리케이션을 등록하고 API 키를 발급받아야 합니다.
        </GuideText>
        <GuideText>
          <strong>1단계:</strong> 네이버 개발자 센터에 접속하여 로그인합니다.<br />
          <strong>2단계:</strong> &apos;Application 등록&apos; 메뉴에서 새 애플리케이션을 등록합니다.<br />
          <strong>3단계:</strong> 검색 API와 광고 API 사용 권한을 설정합니다.<br />
          <strong>4단계:</strong> 발급받은 Client ID, Client Secret, Customer ID를 위 입력 필드에 입력합니다.
        </GuideText>
        <GuideText>
          자세한 내용은{' '}
          <GuideLink
            href="https://developers.naver.com/docs/common/openapiguide/appregister.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            네이버 개발자 센터 가이드
          </GuideLink>
          를 참고하세요.
        </GuideText>
      </GuideSection>
    </SettingsContainer>
  );
}
